/**
 * Manages the Web Audio API context for audio visualization
 */
export class AudioContextManager {
  private audioContext: AudioContext;
  private analyzer: AnalyserNode;
  private source: MediaElementAudioSourceNode | null = null;
  private isInitialized = false;

  constructor(audioElement: HTMLAudioElement) {
    // Create audio context with fallback for older browsers
    this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    // Configure analyzer for visualization
    this.analyzer = this.audioContext.createAnalyser();
    this.analyzer.fftSize = 2048; // Higher for more detailed visualization
    this.analyzer.smoothingTimeConstant = 0.8; // Smoother transitions
    
    try {
      // Connect audio element to analyzer
      this.source = this.audioContext.createMediaElementSource(audioElement);
      this.source.connect(this.analyzer);
      this.analyzer.connect(this.audioContext.destination);
      this.isInitialized = true;
    } catch (error) {
      console.error('Failed to initialize audio context:', error);
    }
  }

  /**
   * Resume audio context if suspended (needed for autoplay policies)
   */
  async resume() {
    if (!this.isInitialized) return;
    
    if (this.audioContext.state === 'suspended') {
      try {
        await this.audioContext.resume();
      } catch (error) {
        console.error('Failed to resume audio context:', error);
      }
    }
  }

  /**
   * Get the analyzer node for visualization
   */
  getAnalyzer() {
    return this.analyzer;
  }

  /**
   * Clean up resources when component unmounts
   */
  async cleanup() {
    if (!this.isInitialized || !this.source) return;
    
    try {
      // Disconnect nodes before closing
      this.source.disconnect();
      this.analyzer.disconnect();
      return await this.audioContext.close();
    } catch (error) {
      console.error('Error cleaning up audio context:', error);
    }
  }
}
