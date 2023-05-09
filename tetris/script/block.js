export class Block {
  static blockSize;

  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.color = color;
  }

  setSize(argBlockSize) {
    blockSize = argBlockSize;
  }

  drawBlock(ctx) {
    startDrawX = this.x * blockSize;
    startDrawY = this.y * blockSize;
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.fillRect(startDrawX, startDrawY, blockSize, blockSize);
  }
}
