import { 
  Connection, 
  PublicKey, 
  Keypair, 
  Transaction, 
  SystemProgram, 
  LAMPORTS_PER_SOL,
  sendAndConfirmTransaction
} from '@solana/web3.js';

export interface PayoutRequest {
  recipientAddress: string;
  amount: number; // in SOL
  userId: string;
  periodStart: Date;
  periodEnd: Date;
}

export interface PayoutResult {
  success: boolean;
  signature?: string;
  error?: string;
}

class SolanaPaymentService {
  private connection: Connection;
  private payerKeypair: Keypair;
  private creatorWallet: PublicKey;

  constructor() {
    // Initialize connection
    this.connection = new Connection(
      process.env.SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com',
      'confirmed'
    );

    // Initialize payer keypair from private key
    const privateKeyString = process.env.SOLANA_PRIVATE_KEY;
    if (!privateKeyString) {
      throw new Error('SOLANA_PRIVATE_KEY environment variable is required');
    }

    try {
      // Decode base58 private key
      const privateKeyBytes = this.base58ToUint8Array(privateKeyString);
      this.payerKeypair = Keypair.fromSecretKey(privateKeyBytes);
    } catch (error) {
      throw new Error('Invalid SOLANA_PRIVATE_KEY format. Expected base58 encoded private key.');
    }

    // Initialize creator wallet
    const creatorAddress = process.env.CREATOR_WALLET_ADDRESS;
    if (!creatorAddress) {
      throw new Error('CREATOR_WALLET_ADDRESS environment variable is required');
    }
    this.creatorWallet = new PublicKey(creatorAddress);
  }

  private base58ToUint8Array(base58: string): Uint8Array {
    const alphabet = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
    let decoded = BigInt(0);
    let multi = BigInt(1);
    
    for (let i = base58.length - 1; i >= 0; i--) {
      const char = base58[i];
      const index = alphabet.indexOf(char);
      if (index === -1) throw new Error('Invalid base58 character');
      decoded += BigInt(index) * multi;
      multi *= BigInt(58);
    }
    
    const bytes = [];
    while (decoded > 0) {
      bytes.unshift(Number(decoded % BigInt(256)));
      decoded = decoded / BigInt(256);
    }
    
    // Add leading zeros
    for (let i = 0; i < base58.length && base58[i] === '1'; i++) {
      bytes.unshift(0);
    }
    
    return new Uint8Array(bytes);
  }

  /**
   * Get the current SOL balance of the payer wallet
   */
  async getBalance(): Promise<number> {
    try {
      const balance = await this.connection.getBalance(this.payerKeypair.publicKey);
      return balance / LAMPORTS_PER_SOL;
    } catch (error) {
      console.error('Error getting balance:', error);
      throw new Error('Failed to get wallet balance');
    }
  }

  /**
   * Send SOL to a recipient address
   */
  async sendPayment(request: PayoutRequest): Promise<PayoutResult> {
    try {
      const recipientPubkey = new PublicKey(request.recipientAddress);
      const lamports = Math.floor(request.amount * LAMPORTS_PER_SOL);

      // Check if we have enough balance
      const balance = await this.getBalance();
      if (balance < request.amount + 0.001) { // 0.001 SOL for transaction fee
        return {
          success: false,
          error: `Insufficient balance. Required: ${request.amount + 0.001} SOL, Available: ${balance} SOL`
        };
      }

      // Create transaction
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: this.payerKeypair.publicKey,
          toPubkey: recipientPubkey,
          lamports,
        })
      );

      // Get recent blockhash
      const { blockhash } = await this.connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = this.payerKeypair.publicKey;

      // Send transaction
      const signature = await sendAndConfirmTransaction(
        this.connection,
        transaction,
        [this.payerKeypair],
        {
          commitment: 'confirmed',
          maxRetries: 3,
        }
      );

      console.log(`Payment sent successfully. Signature: ${signature}`);

      return {
        success: true,
        signature,
      };

    } catch (error) {
      console.error('Error sending payment:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  /**
   * Send creator fee to the creator wallet
   */
  async sendCreatorFee(amount: number): Promise<PayoutResult> {
    return this.sendPayment({
      recipientAddress: this.creatorWallet.toString(),
      amount,
      userId: 'creator',
      periodStart: new Date(),
      periodEnd: new Date(),
    });
  }

  /**
   * Validate a Solana wallet address
   */
  static isValidAddress(address: string): boolean {
    try {
      new PublicKey(address);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get transaction details by signature
   */
  async getTransaction(signature: string) {
    try {
      const transaction = await this.connection.getTransaction(signature, {
        commitment: 'confirmed'
      });
      return transaction;
    } catch (error) {
      console.error('Error getting transaction:', error);
      return null;
    }
  }

  /**
   * Calculate payout amounts for users
   */
  static calculatePayouts(
    users: Array<{ id: string; totalPoints: number; walletAddress: string | null }>,
    totalRewardPool: number,
    creatorFeePercentage: number = 5
  ): Array<{ userId: string; amount: number; creatorFee: number }> {
    const usersWithWallets = users.filter(user => user.walletAddress && user.totalPoints > 0);
    
    if (usersWithWallets.length === 0) {
      return [];
    }

    const totalPoints = usersWithWallets.reduce((sum, user) => sum + user.totalPoints, 0);
    
    if (totalPoints === 0) {
      return [];
    }

    const creatorFeeAmount = (totalRewardPool * creatorFeePercentage) / 100;
    const remainingRewardPool = totalRewardPool - creatorFeeAmount;

    return usersWithWallets.map(user => ({
      userId: user.id,
      amount: (user.totalPoints / totalPoints) * remainingRewardPool,
      creatorFee: (user.totalPoints / totalPoints) * creatorFeeAmount,
    }));
  }
}

export const solanaPaymentService = new SolanaPaymentService();