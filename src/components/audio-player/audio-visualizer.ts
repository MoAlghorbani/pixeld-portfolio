/**
 * Visualizes audio data on a canvas element
 */
export class AudioVisualizer {
  private animationFrame: number | undefined;
  private ctx: CanvasRenderingContext2D | null;
  private dataArray: Uint8Array;
  private bufferLength: number;
  private isRunning = false;

  constructor(
    private canvas: HTMLCanvasElement,
    private analyzer: AnalyserNode
  ) {
    // Get the drawing context
    this.ctx = this.canvas.getContext('2d');
    
    // Set up data buffer for visualization
    this.bufferLength = this.analyzer.frequencyBinCount;
    this.dataArray = new Uint8Array(this.bufferLength);
    
    // Initialize with black screen
    this.clearToBlack();
  }

  /**
   * Start the visualization animation
   */
  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.draw();
  }

  /**
   * Stop the visualization animation
   */
  stop() {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = undefined;
    }
    this.isRunning = false;
  }
  
  /**
   * Clear the canvas to black (used when screen is off)
   */
  clearToBlack() {
    if (!this.ctx) return;
    
    this.ctx.fillStyle = 'rgb(0, 0, 0)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  /**
   * Draw the visualization frame
   */
  private draw = () => {
    if (!this.ctx || !this.isRunning) return;

    // Get current audio data
    this.analyzer.getByteTimeDomainData(this.dataArray);

    // Clear background
    this.ctx.fillStyle = 'rgb(0, 0, 0)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Set up line style
    this.ctx.lineWidth = 2;
    this.ctx.strokeStyle = 'rgb(0, 255, 0)';
    this.ctx.shadowBlur = 4;
    this.ctx.shadowColor = 'rgb(0, 255, 0)';

    // Draw waveform
    this.ctx.beginPath();
    const sliceWidth = this.canvas.width / this.bufferLength;
    let x = 0;

    for (let i = 0; i < this.bufferLength; i++) {
      const v = this.dataArray[i] / 128.0; // normalize to 0-2 range
      const y = (v * this.canvas.height) / 2;

      if (i === 0) {
        this.ctx.moveTo(x, y);
      } else {
        this.ctx.lineTo(x, y);
      }

      x += sliceWidth;
    }

    this.ctx.lineTo(this.canvas.width, this.canvas.height / 2);
    this.ctx.stroke();

    // Request next frame
    this.animationFrame = requestAnimationFrame(this.draw);
  };
}
