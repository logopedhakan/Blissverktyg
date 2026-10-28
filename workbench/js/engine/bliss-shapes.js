// AUTO-GENERATED from Elementfuncs.pas by transpile.py — do not hand-edit.
// Original: (c) AnyCom AB / P-O Hedvall, WinBliss Bliss_Common engine.
const BLISS_SHAPES = {
  ElementA1(X, Y, Dir) {
    const PA = this.PA;
    let rectBottom, rectLeft, rectRight, rectTop, startX, startY, stopX, stopY;
    switch (Dir) {
    case 1: {
    this.ElementK4(X + 1, Y, 2);
    this.ElementK4(X, (Y + 4), 4);
    } break;
    case 2: {
    this.ElementK4(X, Y, 1);
    this.ElementK4(X + 4, Y + 1, 3);
    } break;
    case 3: {
    this.ElementK4(X, Y, 4);
    this.ElementK4(X + 1, Y + 4, 2);
    } break;
    case 4: {
    this.ElementK4(X, Y + 1, 3);
    this.ElementK4(X + 2 * 2, Y, 1);
    } break;
    case 5: {
    this.ElementK4(X, Y, 4);
    } break;
    }
  },
  ElementB1(X, Y, Dir) {
    const PA = this.PA;
    let rectBottom, rectLeft, rectRight, rectTop, startX, startY, stopX, stopY;
    rectLeft = Math.trunc((X + -0.03 * 2) * this.g);
    rectTop = Math.trunc((Y + -3.5 * 2) * this.g);
    rectRight = Math.trunc((X + 7.95 * 2) * this.g);
    rectBottom = Math.trunc((Y + 4.5 * 2) * this.g);
    startX = X * this.g;
    startY = (Y + 1 * 2) * this.g;
    stopX = (X + 2 * 2) * this.g;
    stopY = (Y + 4 * 2) * this.g;
    this.arc(rectLeft + this.ox, rectTop + this.oy, rectRight + this.ox, rectBottom + this.oy, startX + this.ox, startY + this.oy, stopX + this.ox, stopY + this.oy);
    rectLeft = Math.trunc(X + 0) * this.g;
    rectTop = Math.trunc(Y + 0) * this.g;
    rectRight = Math.trunc(X + 2 * 2) * this.g;
    rectBottom = Math.trunc(Y + 2 * 2) * this.g;
    startX = (X + 2 * 2) * this.g;
    startY = (Y + 1 * 2) * this.g;
    stopX = (X + 0) * this.g;
    stopY = (Y + 1 * 2) * this.g;
    this.arc(rectLeft + this.ox, rectTop + this.oy, rectRight + this.ox, rectBottom + this.oy, startX + this.ox, startY + this.oy, stopX + this.ox, stopY + this.oy);
    this.ElementE1(X + 2 * 2, Y, 1);
  },
  ElementC1(X, Y, Dir) {
    const PA = this.PA;
    PA[1] = (X+0 * 2)*this.g;
    PA[2] = (Y+1 * 2)*this.g;
    PA[3] = (X+4 * 2)*this.g;
    PA[4] = (Y+1 * 2)*this.g;
    PA[5] = (X+0 * 2)*this.g;
    PA[6] = (Y+3 * 2)*this.g;
    PA[7] = (X+4 * 2)*this.g;
    PA[8] = (Y+3 * 2)*this.g;
    PA[9] = (X+1 * 2)*this.g;
    PA[10] = (Y+0 * 2)*this.g;
    PA[11] = (X+1 * 2)*this.g;
    PA[12] = (Y+4 * 2)*this.g;
    PA[13] = (X+3 * 2)*this.g;
    PA[14] = (Y+0 * 2)*this.g;
    PA[15] = (X+3 * 2)*this.g;
    PA[16] = (Y+4 * 2)*this.g;
    this.lines(4);
  },
  ElementC2(X, Y, Dir) {
    const PA = this.PA;
    PA[1] = (X+1 * 2)*this.g;
    PA[2] = (Y+1 * 2)*this.g;
    PA[3] = (X+5 * 2)*this.g;
    PA[4] = (Y+1 * 2)*this.g;
    PA[5] = (X+0 * 2)*this.g;
    PA[6] = (Y+3 * 2)*this.g;
    PA[7] = (X+4 * 2)*this.g;
    PA[8] = (Y+3 * 2)*this.g;
    PA[9] = (X+ 5)*this.g;
    PA[10] = (Y+0 * 2)*this.g;
    PA[11] = (X+ 1)*this.g;
    PA[12] = (Y+4 * 2)*this.g;
    PA[13] = (X+ 9)*this.g;
    PA[14] = (Y+0 * 2)*this.g;
    PA[15] = (X+5)*this.g;
    PA[16] = (Y+4 * 2)*this.g;
    this.lines(4);
  },
  ElementD1(X, Y, Dir) {
    const PA = this.PA;
    PA[1] = (X+2 * 2)*this.g;
    PA[2] = (Y+0)*this.g;
    PA[3] = (X+0)*this.g;
    PA[4] = (Y+2 * 2)*this.g;
    PA[5] = (X+0)*this.g;
    PA[6] = (Y+2 * 2)*this.g;
    PA[7] = (X+0)*this.g;
    PA[8] = (Y+4 * 2)*this.g;
    PA[9] = (X+0)*this.g;
    PA[10] = (Y+4 * 2)*this.g;
    PA[11] = (X+4 * 2)*this.g;
    PA[12] = (Y+4 * 2)*this.g;
    PA[13] = (X+4 * 2)*this.g;
    PA[14] = (Y+4 * 2)*this.g;
    PA[15] = (X+4 * 2)*this.g;
    PA[16] = (Y+2 * 2)*this.g;
    PA[17] = (X+4 * 2)*this.g;
    PA[18] = (Y+2 * 2)*this.g;
    PA[19] = (X+2 * 2)*this.g;
    PA[20] = (Y+0)*this.g;
    this.lines(5);
  },
  ElementE1(X, Y, Dir) {
    const PA = this.PA;
    let rectBottom, rectLeft, rectRight, rectTop, startX, startY, stopX, stopY;
    rectLeft = Math.trunc(X + 0) * this.g;
    rectTop = Math.trunc(Y + 0) * this.g;
    rectRight = Math.trunc(X + 2 * 2) * this.g;
    rectBottom = Math.trunc(Y + 2 * 2) * this.g;
    startX = (X + 2 * 2) * this.g;
    startY = (Y + 1 * 2) * this.g;
    stopX = (X + 0) * this.g;
    stopY = (Y + 1 * 2) * this.g;
    this.arc(rectLeft + this.ox, rectTop + this.oy, rectRight + this.ox, rectBottom + this.oy, startX + this.ox, startY + this.oy, stopX + this.ox, stopY + this.oy);
    rectLeft = Math.trunc((X + -5.95 * 2) * this.g);
    rectTop = Math.trunc((Y + -3.5 * 2) * this.g);
    rectRight = Math.trunc((X + 2.05 * 2) * this.g);
    rectBottom = Math.trunc((Y + 4.5 * 2) * this.g);
    startX = (X + 0)* this.g;
    startY = (Y + 4 * 2) * this.g;
    stopX = (X + 2 * 2) * this.g;
    stopY = (Y + 1 * 2) * this.g;
    this.arc(rectLeft + this.ox, rectTop + this.oy, rectRight + this.ox, rectBottom + this.oy, startX + this.ox, startY + this.oy, stopX + this.ox, stopY + this.oy);
  },
  ElementF1(X, Y, Dir) {
    const PA = this.PA;
    switch (Dir) {
    case 1: {
    PA[1] = (X+1 * 2)*this.g;
    PA[2] = (Y+0 * 2)*this.g;
    PA[3] = (X+0 * 2)*this.g;
    PA[4] = (Y+1 * 2)*this.g;
    PA[5] = (X+1 * 2)*this.g;
    PA[6] = (Y+0 * 2)*this.g;
    PA[7] = (X+2 * 2)*this.g;
    PA[8] = (Y+1 * 2)*this.g;
    PA[9] = (X+1 * 2)*this.g;
    PA[10] = (Y+0 * 2)*this.g;
    PA[11] = (X+1 * 2)*this.g;
    PA[12] = (Y+4 * 2)*this.g;
    this.lines(3);
    } break;
    case 2: {
    PA[1] = (X+0 * 2)*this.g;
    PA[2] = (Y+1 * 2)*this.g;
    PA[3] = (X+4 * 2)*this.g;
    PA[4] = (Y+1 * 2)*this.g;
    PA[5] = (X+4 * 2)*this.g;
    PA[6] = (Y+1 * 2)*this.g;
    PA[7] = (X+3 * 2)*this.g;
    PA[8] = (Y+0 * 2)*this.g;
    PA[9] = (X+4 * 2)*this.g;
    PA[10] = (Y+1 * 2)*this.g;
    PA[11] = (X+3 * 2)*this.g;
    PA[12] = (Y+2 * 2)*this.g;
    this.lines(3);
    } break;
    case 3: {
    PA[1] = (X+1 * 2)*this.g;
    PA[2] = (Y+0 * 2)*this.g;
    PA[3] = (X+1 * 2)*this.g;
    PA[4] = (Y+4 * 2)*this.g;
    PA[5] = (X+1 * 2)*this.g;
    PA[6] = (Y+4 * 2)*this.g;
    PA[7] = (X+0 * 2)*this.g;
    PA[8] = (Y+3 * 2)*this.g;
    PA[9] = (X+1 * 2)*this.g;
    PA[10] = (Y+4 * 2)*this.g;
    PA[11] = (X+2 * 2)*this.g;
    PA[12] = (Y+3 * 2)*this.g;
    this.lines(3);
    } break;
    case 4: {
    PA[1] = (X+0 * 2)*this.g;
    PA[2] = (Y+1 * 2)*this.g;
    PA[3] = (X+4 * 2)*this.g;
    PA[4] = (Y+1 * 2)*this.g;
    PA[5] = (X+0 * 2)*this.g;
    PA[6] = (Y+1 * 2)*this.g;
    PA[7] = (X+1 * 2)*this.g;
    PA[8] = (Y+0 * 2)*this.g;
    PA[9] = (X+0 * 2)*this.g;
    PA[10] = (Y+1 * 2)*this.g;
    PA[11] = (X+1 * 2)*this.g;
    PA[12] = (Y+2 * 2)*this.g;
    this.lines(3);
    } break;
    }
  },
  ElementF2(X, Y, Dir) {
    const PA = this.PA;
    switch (Dir) {
    case 1: {
    PA[1] = (X+0 * 2)*this.g;
    PA[2] = (Y+0 * 2)*this.g;
    PA[3] = (X+4 * 2)*this.g;
    PA[4] = (Y+4 * 2)*this.g;
    PA[5] = (X+0 * 2)*this.g;
    PA[6] = (Y+0 * 2)*this.g;
    PA[7] = (X+1 * 2)*this.g;
    PA[8] = (Y+0 * 2)*this.g;
    PA[9] = (X+0 * 2)*this.g;
    PA[10] = (Y+0 * 2)*this.g;
    PA[11] = (X+0 * 2)*this.g;
    PA[12] = (Y+1 * 2)*this.g;
    this.lines(3);
    } break;
    case 2: {
    PA[1] = (X+4 * 2)*this.g;
    PA[2] = (Y+0 * 2)*this.g;
    PA[3] = (X+0 * 2)*this.g;
    PA[4] = (Y+4 * 2)*this.g;
    PA[5] = (X+4 * 2)*this.g;
    PA[6] = (Y+0 * 2)*this.g;
    PA[7] = (X+3 * 2)*this.g;
    PA[8] = (Y+0 * 2)*this.g;
    PA[9] = (X+4 * 2)*this.g;
    PA[10] = (Y+0 * 2)*this.g;
    PA[11] = (X+4 * 2)*this.g;
    PA[12] = (Y+1 * 2)*this.g;
    this.lines(3);
    } break;
    case 3: {
    PA[1] = (X+0 * 2)*this.g;
    PA[2] = (Y+0 * 2)*this.g;
    PA[3] = (X+4 * 2)*this.g;
    PA[4] = (Y+4 * 2)*this.g;
    PA[5] = (X+4 * 2)*this.g;
    PA[6] = (Y+4 * 2)*this.g;
    PA[7] = (X+4 * 2)*this.g;
    PA[8] = (Y+3 * 2)*this.g;
    PA[9] = (X+4 * 2)*this.g;
    PA[10] = (Y+4 * 2)*this.g;
    PA[11] = (X+3 * 2)*this.g;
    PA[12] = (Y+4 * 2)*this.g;
    this.lines(3);
    } break;
    case 4: {
    PA[1] = (X+4 * 2)*this.g;
    PA[2] = (Y+0 * 2)*this.g;
    PA[3] = (X+0 * 2)*this.g;
    PA[4] = (Y+4 * 2)*this.g;
    PA[5] = (X+0 * 2)*this.g;
    PA[6] = (Y+4 * 2)*this.g;
    PA[7] = (X+0 * 2)*this.g;
    PA[8] = (Y+3 * 2)*this.g;
    PA[9] = (X+0 * 2)*this.g;
    PA[10] = (Y+4 * 2)*this.g;
    PA[11] = (X+1 * 2)*this.g;
    PA[12] = (Y+4 * 2)*this.g;
    this.lines(3);
    } break;
    }
  },
  ElementG1(X, Y, Dir) {
    const PA = this.PA;
    this.ElementI1(X, Y, Dir);
    PA[1] = Math.trunc((X+1.7071 * 2)*this.g);
    PA[2] = Math.trunc((Y+0.2928 * 2)*this.g);
    PA[3] = Math.trunc((X+0.2928 * 2)*this.g);
    PA[4] = Math.trunc((Y+1.7071 * 2)*this.g);
    PA[5] = Math.trunc((X+0.2928 * 2)*this.g);
    PA[6] = Math.trunc((Y+0.2928 * 2)*this.g);
    PA[7] = Math.trunc((X+1.7071 * 2)*this.g);
    PA[8] = Math.trunc((Y+1.7071 * 2)*this.g);
    this.lines(2);
  },
  ElementG2(X, Y, Dir) {
    const PA = this.PA;
    this.ElementH3(X, Y, Dir);
    PA[1] = Math.trunc((X+1.7071 * 4)*this.g);
    PA[2] = Math.trunc((Y+0.2928 * 4)*this.g);
    PA[3] = Math.trunc((X+0.2928 * 4)*this.g);
    PA[4] = Math.trunc((Y+1.7071 * 4)*this.g);
    PA[5] = Math.trunc((X+0.2928 * 4)*this.g);
    PA[6] = Math.trunc((Y+0.2928 * 4)*this.g);
    PA[7] = Math.trunc((X+1.7071 * 4)*this.g);
    PA[8] = Math.trunc((Y+1.7071 * 4)*this.g);
    this.lines(2);
  },
  ElementH1(X, Y, Dir) {
    const PA = this.PA;
    let rectBottom, rectLeft, rectRight, rectTop, startX, startY, stopX, stopY;
    rectLeft = Math.trunc(X + 0) * this.g;
    rectTop = Math.trunc(Y + 0) * this.g;
    rectRight = Math.trunc(X + 1 * 2) * this.g;
    rectBottom = Math.trunc(Y + 1 * 2) * this.g;
    startX = (X + 0) * this.g;
    startY = Math.trunc((Y + 0.5 * 2) * this.g);
    stopX = (X + 0) * this.g;
    stopY = Math.trunc((Y + 0.5 * 2) * this.g);
    this.arc(rectLeft + this.ox, rectTop + this.oy, rectRight + this.ox, rectBottom + this.oy, startX + this.ox, startY + this.oy, stopX + this.ox, stopY + this.oy);
  },
  ElementH2(X, Y, Dir) {
    const PA = this.PA;
    let rectBottom, rectLeft, rectRight, rectTop, startX, startY, stopX, stopY;
    rectLeft = Math.trunc(X + 0) * this.g;
    rectTop = Math.trunc(Y + 0) * this.g;
    rectRight = Math.trunc(X + 2 * 2) * this.g;
    rectBottom = Math.trunc(Y + 2 * 2) * this.g;
    startX = (X + 0) * this.g;
    startY = (Y + 1 * 2) * this.g;
    stopX = (X + 0 * 2) * this.g;
    stopY = (Y + 1 * 2) * this.g;
    this.arc(rectLeft + this.ox, rectTop + this.oy, rectRight + this.ox, rectBottom + this.oy, startX + this.ox, startY + this.oy, stopX + this.ox, stopY + this.oy);
  },
  ElementH3(X, Y, Dir) {
    const PA = this.PA;
    let rectBottom, rectLeft, rectRight, rectTop, startX, startY, stopX, stopY;
    rectLeft = Math.trunc(X + 0) * this.g;
    rectTop = Math.trunc(Y + 0) * this.g;
    rectRight = Math.trunc(X + 4 * 2) * this.g;
    rectBottom = Math.trunc(Y + 4 * 2) * this.g;
    startX = (X + 0) * this.g;
    startY = (Y + 2 * 2) * this.g;
    stopX = (X + 0) * this.g;
    stopY = (Y + 2 * 2) * this.g;
    this.arc(rectLeft + this.ox, rectTop + this.oy, rectRight + this.ox, rectBottom + this.oy, startX + this.ox, startY + this.oy, stopX + this.ox, stopY + this.oy);
  },
  ElementH4(X, Y, Dir) {
    const PA = this.PA;
    let rectBottom, rectLeft, rectRight, rectTop, startX, startY, stopX, stopY;
    this.ElementH2(X, Y, 1);
    this.ElementH2(X + 1 * 2, Y, 1 * 2);
  },
  ElementH5(X, Y, Dir) {
    const PA = this.PA;
    let rectBottom, rectLeft, rectRight, rectTop, startX, startY, stopX, stopY;
    this.ElementH1(X, Y, 1);
    rectLeft = Math.trunc((X + 0.5 * 2) * this.g);
    rectTop = Math.trunc((Y + 0) * this.g);
    rectRight = Math.trunc((X + 1.5 * 2) * this.g);
    rectBottom = Math.trunc((Y + 1 * 2) * this.g);
    startX = Math.trunc((X + 0.5 * 2) * this.g);
    startY = Math.trunc((Y + 0.5 * 2) * this.g);
    stopX = Math.trunc((X + 0.5 * 2) * this.g);
    stopY = Math.trunc((Y + 0.5 * 2) * this.g);
    this.arc(rectLeft + this.ox, rectTop + this.oy, rectRight + this.ox, rectBottom + this.oy, startX + this.ox, startY + this.oy, stopX + this.ox, stopY + this.oy);
  },
  ElementI1(X, Y, Dir) {
    const PA = this.PA;
    let rectBottom, rectLeft, rectRight, rectTop, startX, startY, stopX, stopY;
    rectLeft = Math.trunc(X + 0) * this.g;
    rectTop = Math.trunc(Y + 0) * this.g;
    rectRight = Math.trunc(X + 2 * 2) * this.g;
    rectBottom = Math.trunc(Y + 2 * 2) * this.g;
    startX = (X + 0) * this.g;
    startY = (Y + -1 * 2) * this.g;
    stopX = (X + 0) * this.g;
    stopY = (Y + -1 * 2) * this.g;
    this.arc(rectLeft + this.ox, rectTop + this.oy, rectRight + this.ox, rectBottom + this.oy, startX + this.ox, startY + this.oy, stopX + this.ox, stopY + this.oy);
  },
  ElementI2(X, Y, Dir) {
    const PA = this.PA;
    let rectBottom, rectLeft, rectRight, rectTop, startX, startY, stopX, stopY;
    rectLeft = Math.trunc(X + 0) * this.g;
    rectTop = Math.trunc(Y + 0) * this.g;
    rectRight = Math.trunc(X + 4 * 2) * this.g;
    rectBottom = Math.trunc(Y + 4 * 2) * this.g;
    startX = (X + 0) * this.g;
    startY = (Y + -2 * 2) * this.g;
    stopX = (X + 0) * this.g;
    stopY = (Y + -2 * 2) * this.g;
    this.arc(rectLeft + this.ox, rectTop + this.oy, rectRight + this.ox, rectBottom + this.oy, startX + this.ox, startY + this.oy, stopX + this.ox, stopY + this.oy);
  },
  ElementJ1(X, Y, Dir) {
    const PA = this.PA;
    let rectBottom, rectLeft, rectRight, rectTop, startX, startY, stopX, stopY;
    switch (Dir) {
    case 1: {
    rectLeft = Math.trunc(X + 0) * this.g;
    rectTop = Math.trunc(Y + 0) * this.g;
    rectRight = Math.trunc(X + 4 * 2) * this.g;
    rectBottom = Math.trunc(Y + 4 * 2) * this.g;
    startX = (X + 4 * 2) * this.g;
    startY = (Y + 2 * 2) * this.g;
    stopX = (X + 0) * this.g;
    stopY = (Y + 2 * 2) * this.g;
    this.arc(rectLeft + this.ox, rectTop + this.oy, rectRight + this.ox, rectBottom + this.oy, startX + this.ox, startY + this.oy, stopX + this.ox, stopY + this.oy);
    } break;
    case 2: {
    rectLeft = Math.trunc(X + -2 * 2) * this.g;
    rectTop = Math.trunc(Y + 0) * this.g;
    rectRight = Math.trunc(X + 2 * 2) * this.g;
    rectBottom = Math.trunc(Y + 4 * 2) * this.g;
    startX = (X + 0) * this.g;
    startY = (Y + 4 * 2) * this.g;
    stopX = (X + 0) * this.g;
    stopY = (Y + 0) * this.g;
    this.arc(rectLeft + this.ox, rectTop + this.oy, rectRight + this.ox, rectBottom + this.oy, startX + this.ox, startY + this.oy, stopX + this.ox, stopY + this.oy);
    } break;
    case 3: {
    rectLeft = Math.trunc(X + 0) * this.g;
    rectTop = Math.trunc(Y + -2 * 2) * this.g;
    rectRight = Math.trunc(X + 4 * 2) * this.g;
    rectBottom = Math.trunc(Y + 2 * 2) * this.g;
    startX = (X + 0) * this.g;
    startY = (Y + 0) * this.g;
    stopX = (X + 4 * 2) * this.g;
    stopY = (Y + 0) * this.g;
    this.arc(rectLeft + this.ox, rectTop + this.oy, rectRight + this.ox, rectBottom + this.oy, startX + this.ox, startY + this.oy, stopX + this.ox, stopY + this.oy);
    } break;
    case 4: {
    rectLeft = Math.trunc(X + 0) * this.g;
    rectTop = Math.trunc(Y + 0) * this.g;
    rectRight = Math.trunc(X + 4 * 2) * this.g;
    rectBottom = Math.trunc(Y + 4 * 2) * this.g;
    startX = (X + 2 * 2) * this.g;
    startY = (Y + 0) * this.g;
    stopX = (X + 2 * 2) * this.g;
    stopY = (Y + 4 * 2) * this.g;
    this.arc(rectLeft + this.ox, rectTop + this.oy, rectRight + this.ox, rectBottom + this.oy, startX + this.ox, startY + this.oy, stopX + this.ox, stopY + this.oy);
    } break;
    }
  },
  ElementK1(X, Y, Dir) {
    const PA = this.PA;
    let rectBottom, rectLeft, rectRight, rectTop, startX, startY, stopX, stopY;
    switch (Dir) {
    case 1: {
    rectLeft = Math.trunc(X + 0) * this.g;
    rectTop = Math.trunc(Y + 0) * this.g;
    rectRight = Math.trunc(X + 2 * 2) * this.g;
    rectBottom = Math.trunc(Y + 2 * 2) * this.g;
    startX = (X + 2 * 2) * this.g;
    startY = (Y + 1 * 2) * this.g;
    stopX = (X + 0) * this.g;
    stopY = (Y + 1 * 2) * this.g;
    this.arc(rectLeft + this.ox, rectTop + this.oy, rectRight + this.ox, rectBottom + this.oy, startX + this.ox, startY + this.oy, stopX + this.ox, stopY + this.oy);
    } break;
    case 2: {
    rectLeft = Math.trunc(X + -1 * 2) * this.g;
    rectTop = Math.trunc(Y + 0) * this.g;
    rectRight = Math.trunc(X + 1 * 2) * this.g;
    rectBottom = Math.trunc(Y + 2 * 2) * this.g;
    startX = (X + 0) * this.g;
    startY = (Y + 2 * 2) * this.g;
    stopX = (X + 0) * this.g;
    stopY = (Y + 0) * this.g;
    this.arc(rectLeft + this.ox, rectTop + this.oy, rectRight + this.ox, rectBottom + this.oy, startX + this.ox, startY + this.oy, stopX + this.ox, stopY + this.oy);
    } break;
    case 3: {
    rectLeft = Math.trunc(X + 0) * this.g;
    rectTop = Math.trunc(Y + -1 * 2) * this.g;
    rectRight = Math.trunc(X + 2 * 2) * this.g;
    rectBottom = Math.trunc(Y + 1 * 2) * this.g;
    startX = (X + 0) * this.g;
    startY = (Y + 0) * this.g;
    stopX = (X + 2 * 2) * this.g;
    stopY = (Y + 0) * this.g;
    this.arc(rectLeft + this.ox, rectTop + this.oy, rectRight + this.ox, rectBottom + this.oy, startX + this.ox, startY + this.oy, stopX + this.ox, stopY + this.oy);
    } break;
    case 4: {
    rectLeft = Math.trunc(X + 0) * this.g;
    rectTop = Math.trunc(Y + 0) * this.g;
    rectRight = Math.trunc(X + 2 * 2) * this.g;
    rectBottom = Math.trunc(Y + 2 * 2) * this.g;
    startX = (X + 1 * 2) * this.g;
    startY = (Y + 0) * this.g;
    stopX = (X + 1 * 2) * this.g;
    stopY = (Y + 2 * 2) * this.g;
    this.arc(rectLeft + this.ox, rectTop + this.oy, rectRight + this.ox, rectBottom + this.oy, startX + this.ox, startY + this.oy, stopX + this.ox, stopY + this.oy);
    } break;
    }
  },
  ElementK2(X, Y, Dir) {
    const PA = this.PA;
    let rectBottom, rectLeft, rectRight, rectTop, startX, startY, stopX, stopY;
    switch (Dir) {
    case 1: {
    rectLeft = Math.trunc(X + 0) * this.g;
    rectTop = Math.trunc(Y + 0) * this.g;
    rectRight = Math.trunc(X + 4 * 2) * this.g;
    rectBottom = Math.trunc(Y + 4 * 2) * this.g;
    startX = (X + 2 * 2) * this.g;
    startY = (Y + 0) * this.g;
    stopX = (X + 0) * this.g;
    stopY = (Y + 2 * 2) * this.g;
    this.arc(rectLeft + this.ox, rectTop + this.oy, rectRight + this.ox, rectBottom + this.oy, startX + this.ox, startY + this.oy, stopX + this.ox, stopY + this.oy);
    } break;
    case 2: {
    rectLeft = Math.trunc(X + -2 * 2) * this.g;
    rectTop = Math.trunc(Y + 0) * this.g;
    rectRight = Math.trunc(X + 2 * 2) * this.g;
    rectBottom = Math.trunc(Y + 4 * 2) * this.g;
    startX = (X + 2 * 2) * this.g;
    startY = (Y + 2 * 2) * this.g;
    stopX = (X + 0) * this.g;
    stopY = (Y + 0) * this.g;
    this.arc(rectLeft + this.ox, rectTop + this.oy, rectRight + this.ox, rectBottom + this.oy, startX + this.ox, startY + this.oy, stopX + this.ox, stopY + this.oy);
    } break;
    case 3: {
    rectLeft = Math.trunc(X + -2 * 2) * this.g;
    rectTop = Math.trunc(Y + -2 * 2) * this.g;
    rectRight = Math.trunc(X + 2 * 2) * this.g;
    rectBottom = Math.trunc(Y + 2 * 2) * this.g;
    startX = (X + 0) * this.g;
    startY = (Y + 2 * 2) * this.g;
    stopX = (X + 2 * 2) * this.g;
    stopY = (Y + 0) * this.g;
    this.arc(rectLeft + this.ox, rectTop + this.oy, rectRight + this.ox, rectBottom + this.oy, startX + this.ox, startY + this.oy, stopX + this.ox, stopY + this.oy);
    } break;
    case 4: {
    rectLeft = Math.trunc(X + 0) * this.g;
    rectTop = Math.trunc(Y + -2 * 2) * this.g;
    rectRight = Math.trunc(X + 4 * 2) * this.g;
    rectBottom = Math.trunc(Y + 2 * 2) * this.g;
    startX = (X + 0) * this.g;
    startY = (Y + 0) * this.g;
    stopX = (X + 2 * 2) * this.g;
    stopY = (Y + 2 * 2) * this.g;
    this.arc(rectLeft + this.ox, rectTop + this.oy, rectRight + this.ox, rectBottom + this.oy, startX + this.ox, startY + this.oy, stopX + this.ox, stopY + this.oy);
    } break;
    }
  },
  ElementK3(X, Y, Dir) {
    const PA = this.PA;
    let rectBottom, rectLeft, rectRight, rectTop, startX, startY, stopX, stopY;
    switch (Dir) {
    case 1: {
    rectLeft = Math.trunc((X + -0.5 * 2) * this.g);
    rectTop = Math.trunc((Y + 0) * this.g);
    rectRight = Math.trunc((X + 4.5 * 2) * this.g);
    rectBottom = Math.trunc((Y + 5 * 2) * this.g);
    startX = (X + 4 * 2) * this.g;
    startY = (Y + 1 * 2) * this.g;
    stopX = (X + 0) * this.g;
    stopY = (Y + 1 * 2) * this.g;
    this.arc(rectLeft + this.ox, rectTop + this.oy, rectRight + this.ox, rectBottom + this.oy, startX + this.ox, startY + this.oy, stopX + this.ox, stopY + this.oy);
    } break;
    case 2: {
    rectLeft = Math.trunc(X + -4 * 2) * this.g;
    rectTop = Math.trunc((Y + -0.5 * 2) * this.g);
    rectRight = Math.trunc(X + 1 * 2) * this.g;
    rectBottom = Math.trunc((Y + 4.5 * 2) * this.g);
    startX = (X + 0) * this.g;
    startY = (Y + 4 * 2) * this.g;
    stopX = (X + 0) * this.g;
    stopY = (Y + 0) * this.g;
    this.arc(rectLeft + this.ox, rectTop + this.oy, rectRight + this.ox, rectBottom + this.oy, startX + this.ox, startY + this.oy, stopX + this.ox, stopY + this.oy);
    } break;
    case 3: {
    rectLeft = Math.trunc((X + -0.5 * 2) * this.g);
    rectTop = Math.trunc(Y + -4 * 2) * this.g;
    rectRight = Math.trunc((X + 4.5 * 2) * this.g);
    rectBottom = Math.trunc(Y + 1 * 2) * this.g;
    startX = (X + 0) * this.g;
    startY = (Y + 0) * this.g;
    stopX = (X + 4 * 2) * this.g;
    stopY = (Y + 0) * this.g;
    this.arc(rectLeft + this.ox, rectTop + this.oy, rectRight + this.ox, rectBottom + this.oy, startX + this.ox, startY + this.oy, stopX + this.ox, stopY + this.oy);
    } break;
    case 4: {
    rectLeft = Math.trunc(X + 0) * this.g;
    rectTop = Math.trunc((Y + -0.5 * 2 ) * this.g);
    rectRight = Math.trunc(X + 5 * 2) * this.g;
    rectBottom = Math.trunc((Y + 4.5 * 2) * this.g);
    startX = (X + 1 * 2) * this.g;
    startY = (Y + 0 * 2) * this.g;
    stopX = (X + 1 * 2) * this.g;
    stopY = (Y + 4 * 2) * this.g;
    this.arc(rectLeft + this.ox, rectTop + this.oy, rectRight + this.ox, rectBottom + this.oy, startX + this.ox, startY + this.oy, stopX + this.ox, stopY + this.oy);
    } break;
    }
  },
  ElementK4(X, Y, Dir) {
    const PA = this.PA;
    let Radi, rectBottom, rectLeft, rectRight, rectTop, startX, startY, stopX, stopY, CenterX, CenterY;
    const RADIUS = 2.8284271247461900976033774484194;
    switch (Dir) {
    case 1: {
    rectLeft = Math.trunc((X + -(RADIUS - 2)) * this.g);
    rectTop = Math.trunc((Y + 0) * this.g);
    rectRight = Math.trunc((X + (RADIUS + 2)) * this.g);
    rectBottom = Math.trunc((Y + (RADIUS + RADIUS)) * this.g);
    startX = Math.trunc((X + 4) * this.g);
    startY = Math.trunc((Y + 1) * this.g);
    stopX = Math.trunc((X + 0) * this.g);
    stopY = Math.trunc((Y + 1) * this.g);
    this.arc(rectLeft + this.ox, rectTop + this.oy, rectRight + this.ox, rectBottom + this.oy, startX + this.ox, startY + this.oy, stopX + this.ox, stopY + this.oy);
    } break;
    case 2: {
    CenterX = ((X - 2) * this.g);
    CenterY = ((Y + 2) * this.g);
    this.pieSlice(CenterX, CenterY, RADIUS * this.g, 315, 46);
    } break;
    case 3: {
    rectLeft = Math.trunc((X + -(RADIUS - 2)) * this.g);
    rectTop = Math.trunc((Y + -(RADIUS + 2)) * this.g);
    rectRight = Math.trunc((X + (RADIUS + 2)) * this.g);
    rectBottom = Math.trunc((Y + (RADIUS - 2)) * this.g);
    startX = (X + 0) * this.g;
    startY = (Y + 0) * this.g;
    stopX = (X + 4) * this.g;
    stopY = (Y + 0) * this.g;
    this.arc(rectLeft + this.ox, rectTop + this.oy, rectRight + this.ox, rectBottom + this.oy, startX + this.ox, startY + this.oy, stopX + this.ox, stopY + this.oy);
    } break;
    case 4: {
    CenterX = ((X + 3) * this.g);
    CenterY = ((Y + 2) * this.g);
    this.pieSlice(CenterX, CenterY, RADIUS * this.g, 135, 225);
    } break;
    }
  },
  ElementK5(X, Y, Dir) {
    const PA = this.PA;
    let Radi, rectBottom, rectLeft, rectRight, rectTop, startX, startY, stopX, stopY, CenterX, CenterY;
    const RADIUS = 1.4142135623730950488016887242097;
    switch (Dir) {
    case 1: {
    rectLeft = Math.trunc((X + -0.4142) * this.g);
    rectTop = Math.trunc((Y + 0.5858 - 1) * this.g);
    rectRight = Math.trunc((X + 2.4142) * this.g);
    rectBottom = Math.trunc((Y + 3.4142 - 1) * this.g);
    startX = Math.trunc((X + 2) * this.g);
    startY = Math.trunc((Y + 1 - 1) * this.g);
    stopX = Math.trunc((X + 0) * this.g);
    stopY = Math.trunc((Y + 1 - 1) * this.g);
    this.arc(rectLeft + this.ox, rectTop + this.oy, rectRight + this.ox, rectBottom + this.oy, startX + this.ox, startY + this.oy, stopX + this.ox, stopY + this.oy);
    } break;
    case 2: {
    CenterX = ((X - 1) * this.g);
    CenterY = ((Y + 1) * this.g);
    this.pieSlice(CenterX, CenterY, RADIUS * this.g, 315, 46);
    } break;
    case 3: {
    rectLeft = Math.trunc((X + -0.4142) * this.g);
    rectTop = Math.trunc((Y + -2.4142) * this.g);
    rectRight = Math.trunc((X + 2.4142) * this.g);
    rectBottom = Math.trunc((Y + 0.4142) * this.g);
    startX = (X + 0) * this.g;
    startY = (Y + 0) * this.g;
    stopX = (X + 2) * this.g;
    stopY = (Y + 0) * this.g;
    this.arc(rectLeft + this.ox, rectTop + this.oy, rectRight + this.ox, rectBottom + this.oy, startX + this.ox, startY + this.oy, stopX + this.ox, stopY + this.oy);
    } break;
    case 4: {
    CenterX = ((X + 1) * this.g);
    CenterY = ((Y + 1) * this.g);
    this.pieSlice(CenterX, CenterY, RADIUS * this.g, 135, 225);
    } break;
    }
  },
  ElementK6(X, Y, Dir) {
    const PA = this.PA;
    let rectBottom, rectLeft, rectRight, rectTop, startX, startY, stopX, stopY;
    switch (Dir) {
    case 1: {
    rectLeft = Math.trunc((X + -0.5 * 2) * this.g);
    rectTop = Math.trunc((Y + 0) * this.g);
    rectRight = Math.trunc((X + 4.5 * 2) * this.g);
    rectBottom = Math.trunc((Y + 5 * 2) * this.g);
    startX = (X + 2 * 2) * this.g;
    startY = (Y + 0 * 2) * this.g;
    stopX = (X + 0) * this.g;
    stopY = (Y + 1 * 2) * this.g;
    this.arc(rectLeft + this.ox, rectTop + this.oy, rectRight + this.ox, rectBottom + this.oy, startX + this.ox, startY + this.oy, stopX + this.ox, stopY + this.oy);
    } break;
    case 2: {
    rectLeft = Math.trunc(X + -4 * 2) * this.g;
    rectTop = Math.trunc((Y + -0.5 * 2) * this.g);
    rectRight = Math.trunc(X + 1 * 2) * this.g;
    rectBottom = Math.trunc((Y + 4.5 * 2) * this.g);
    startX = (X + 1 * 2) * this.g;
    startY = (Y + 2 * 2) * this.g;
    stopX = (X + 0) * this.g;
    stopY = (Y + 0) * this.g;
    this.arc(rectLeft + this.ox, rectTop + this.oy, rectRight + this.ox, rectBottom + this.oy, startX + this.ox, startY + this.oy, stopX + this.ox, stopY + this.oy);
    } break;
    case 3: {
    rectLeft = Math.trunc((X + -0.5 * 2) * this.g);
    rectTop = Math.trunc(Y + -4 * 2) * this.g;
    rectRight = Math.trunc((X + 4.5 * 2) * this.g);
    rectBottom = Math.trunc(Y + 1 * 2) * this.g;
    startX = (X + 0) * this.g;
    startY = (Y + 0) * this.g;
    stopX = (X + 2 * 2) * this.g;
    stopY = (Y + 1 * 2) * this.g;
    this.arc(rectLeft + this.ox, rectTop + this.oy, rectRight + this.ox, rectBottom + this.oy, startX + this.ox, startY + this.oy, stopX + this.ox, stopY + this.oy);
    } break;
    case 4: {
    rectLeft = Math.trunc(X + 0) * this.g;
    rectTop = Math.trunc((Y + -0.5 * 2 ) * this.g);
    rectRight = Math.trunc(X + 5 * 2) * this.g;
    rectBottom = Math.trunc((Y + 4.5 * 2) * this.g);
    startX = (X + 1 * 2) * this.g;
    startY = (Y + 0 * 2) * this.g;
    stopX = (X + 0 * 2) * this.g;
    stopY = (Y + 2 * 2) * this.g;
    this.arc(rectLeft + this.ox, rectTop + this.oy, rectRight + this.ox, rectBottom + this.oy, startX + this.ox, startY + this.oy, stopX + this.ox, stopY + this.oy);
    } break;
    }
  },
  ElementK7(X, Y, Dir) {
    const PA = this.PA;
    let rectBottom, rectLeft, rectRight, rectTop, startX, startY, stopX, stopY;
    switch (Dir) {
    case 1: {
    rectLeft = Math.trunc((X) * this.g);
    rectTop = Math.trunc((Y) * this.g);
    rectRight = Math.trunc((X + 2) * this.g);
    rectBottom = Math.trunc((Y + 2) * this.g);
    startX = Math.trunc((X + 2) * this.g);
    startY = Math.trunc((Y + 1) * this.g);
    stopX = Math.trunc((X + 0) * this.g);
    stopY = Math.trunc((Y + 1) * this.g);
    this.arc(rectLeft + this.ox, rectTop + this.oy, rectRight + this.ox, rectBottom + this.oy, startX + this.ox, startY + this.oy, stopX + this.ox, stopY + this.oy);
    } break;
    case 2: {
    rectLeft = Math.trunc((X) * this.g);
    rectTop = Math.trunc((Y) * this.g);
    rectRight = Math.trunc((X + 2) * this.g);
    rectBottom = Math.trunc((Y + 2) * this.g);
    startX = Math.trunc((X + 1) * this.g);
    startY = Math.trunc((Y + 2) * this.g);
    stopX = Math.trunc((X + 1) * this.g);
    stopY = Math.trunc((Y + 0) * this.g);
    this.arc(rectLeft + this.ox, rectTop + this.oy, rectRight + this.ox, rectBottom + this.oy, startX + this.ox, startY + this.oy, stopX + this.ox, stopY + this.oy);
    } break;
    case 3: {
    rectLeft = Math.trunc((X) * this.g);
    rectTop = Math.trunc((Y) * this.g);
    rectRight = Math.trunc((X + 2) * this.g);
    rectBottom = Math.trunc((Y + 2) * this.g);
    startX = Math.trunc((X + 0) * this.g);
    startY = Math.trunc((Y + 1) * this.g);
    stopX = Math.trunc((X + 2) * this.g);
    stopY = Math.trunc((Y + 1) * this.g);
    this.arc(rectLeft + this.ox, rectTop + this.oy, rectRight + this.ox, rectBottom + this.oy, startX + this.ox, startY + this.oy, stopX + this.ox, stopY + this.oy);
    } break;
    case 4: {
    rectLeft = Math.trunc((X) * this.g);
    rectTop = Math.trunc((Y) * this.g);
    rectRight = Math.trunc((X + 2) * this.g);
    rectBottom = Math.trunc((Y + 2) * this.g);
    startX = Math.trunc((X + 1) * this.g);
    startY = Math.trunc((Y + 0) * this.g);
    stopX = Math.trunc((X + 1) * this.g);
    stopY = Math.trunc((Y + 2) * this.g);
    this.arc(rectLeft + this.ox, rectTop + this.oy, rectRight + this.ox, rectBottom + this.oy, startX + this.ox, startY + this.oy, stopX + this.ox, stopY + this.oy);
    } break;
    }
  },
  ElementK8(X, Y, Dir) {
    const PA = this.PA;
    let rectBottom, rectLeft, rectRight, rectTop, startX, startY, stopX, stopY;
    switch (Dir) {
    case 1: {
    rectLeft = Math.trunc(X + 0) * this.g;
    rectTop = Math.trunc(Y + 0) * this.g;
    rectRight = Math.trunc(X + 2 * 2) * this.g;
    rectBottom = Math.trunc(Y + 2 * 2) * this.g;
    startX = (X + 1 * 2) * this.g;
    startY = (Y + 0) * this.g;
    stopX = (X + 0) * this.g;
    stopY = (Y + 1 * 2) * this.g;
    this.arc(rectLeft + this.ox, rectTop + this.oy, rectRight + this.ox, rectBottom + this.oy, startX + this.ox, startY + this.oy, stopX + this.ox, stopY + this.oy);
    } break;
    case 2: {
    rectLeft = Math.trunc(X + -1 * 2) * this.g;
    rectTop = Math.trunc(Y + 0) * this.g;
    rectRight = Math.trunc(X + 1 * 2) * this.g;
    rectBottom = Math.trunc(Y + 2 * 2) * this.g;
    startX = (X + 1 * 2) * this.g;
    startY = (Y + 1 * 2) * this.g;
    stopX = (X + 0) * this.g;
    stopY = (Y + 0) * this.g;
    this.arc(rectLeft + this.ox, rectTop + this.oy, rectRight + this.ox, rectBottom + this.oy, startX + this.ox, startY + this.oy, stopX + this.ox, stopY + this.oy);
    } break;
    case 3: {
    rectLeft = Math.trunc(X + -1 * 2) * this.g;
    rectTop = Math.trunc(Y + -1 * 2) * this.g;
    rectRight = Math.trunc(X + 1 * 2) * this.g;
    rectBottom = Math.trunc(Y + 1 * 2) * this.g;
    startX = (X + 0) * this.g;
    startY = (Y + 1 * 2) * this.g;
    stopX = (X + 1 * 2) * this.g;
    stopY = (Y + 0) * this.g;
    this.arc(rectLeft + this.ox, rectTop + this.oy, rectRight + this.ox, rectBottom + this.oy, startX + this.ox, startY + this.oy, stopX + this.ox, stopY + this.oy);
    } break;
    case 4: {
    rectLeft = Math.trunc(X + 0) * this.g;
    rectTop = Math.trunc(Y + -1 * 2) * this.g;
    rectRight = Math.trunc(X + 2 * 2) * this.g;
    rectBottom = Math.trunc(Y + 1 * 2) * this.g;
    startX = (X + 0) * this.g;
    startY = (Y + 0) * this.g;
    stopX = (X + 1 * 2) * this.g;
    stopY = (Y + 1 * 2) * this.g;
    this.arc(rectLeft + this.ox, rectTop + this.oy, rectRight + this.ox, rectBottom + this.oy, startX + this.ox, startY + this.oy, stopX + this.ox, stopY + this.oy);
    } break;
    }
  },
  ElementL1(X, Y, Dir) {
    const PA = this.PA;
    PA[1] = (X+0)*this.g;
    PA[2] = (Y+0)*this.g;
    PA[3] = (X+4 * 2)*this.g;
    PA[4] = (Y+0)*this.g;
    PA[5] = (X+4 * 2)*this.g;
    PA[6] = (Y+0)*this.g;
    PA[7] = (X+4 * 2)*this.g;
    PA[8] = (Y+4 * 2)*this.g;
    PA[9] = (X+4 * 2)*this.g;
    PA[10] = (Y+4 * 2)*this.g;
    PA[11] = (X+0)*this.g;
    PA[12] = (Y+4 * 2)*this.g;
    PA[13] = (X+0)*this.g;
    PA[14] = (Y+4 * 2)*this.g;
    PA[15] = (X+0)*this.g;
    PA[16] = (Y+0)*this.g;
    this.lines(4);
  },
  ElementL2(X, Y, Dir) {
    const PA = this.PA;
    PA[1] = (X+0)*this.g;
    PA[2] = (Y+0)*this.g;
    PA[3] = (X+2 * 2)*this.g;
    PA[4] = (Y+0)*this.g;
    PA[5] = (X+2 * 2)*this.g;
    PA[6] = (Y+0)*this.g;
    PA[7] = (X+2 * 2)*this.g;
    PA[8] = (Y+2 * 2)*this.g;
    PA[9] = (X+2 * 2)*this.g;
    PA[10] = (Y+2 * 2)*this.g;
    PA[11] = (X+0)*this.g;
    PA[12] = (Y+2 * 2)*this.g;
    PA[13] = (X+0)*this.g;
    PA[14] = (Y+2 * 2)*this.g;
    PA[15] = (X+0)*this.g;
    PA[16] = (Y+0)*this.g;
    this.lines(4);
  },
  ElementL3(X, Y, Dir) {
    const PA = this.PA;
    PA[1] = (X+0)*this.g;
    PA[2] = (Y+0)*this.g;
    PA[3] = (X+1 * 2)*this.g;
    PA[4] = (Y+0)*this.g;
    PA[5] = (X+1 * 2)*this.g;
    PA[6] = (Y+0)*this.g;
    PA[7] = (X+1 * 2)*this.g;
    PA[8] = (Y+1 * 2)*this.g;
    PA[9] = (X+1 * 2)*this.g;
    PA[10] = (Y+1 * 2)*this.g;
    PA[11] = (X+0)*this.g;
    PA[12] = (Y+1 * 2)*this.g;
    PA[13] = (X+0)*this.g;
    PA[14] = (Y+1 * 2)*this.g;
    PA[15] = (X+0)*this.g;
    PA[16] = (Y+0)*this.g;
    this.lines(4);
  },
  ElementL4(X, Y, Dir) {
    const PA = this.PA;
    PA[1] = Math.trunc((X+0.5 * 2)*this.g);
    PA[2] = (Y+0)*this.g;
    PA[3] = Math.trunc((X+1.5 * 2)*this.g);
    PA[4] = (Y+0)*this.g;
    PA[5] = Math.trunc((X+1.5 * 2)*this.g);
    PA[6] = (Y+0)*this.g;
    PA[7] = Math.trunc((X+1.5 * 2)*this.g);
    PA[8] = (Y+1 * 2)*this.g;
    PA[9] = Math.trunc((X+1.5 * 2)*this.g);
    PA[10] = (Y+1 * 2)*this.g;
    PA[11] = Math.trunc((X+0.5 * 2)*this.g);
    PA[12] = (Y+1 * 2)*this.g;
    PA[13] = Math.trunc((X+0.5 * 2)*this.g);
    PA[14] = (Y+1 * 2)*this.g;
    PA[15] = Math.trunc((X+0.5 * 2)*this.g);
    PA[16] = (Y+0)*this.g;
    this.lines(4);
  },
  ElementM1(X, Y, Dir) {
    const PA = this.PA;
    PA[1] = (X+0)*this.g;
    PA[2] = (Y+0)*this.g;
    PA[3] = (X+2 * 2)*this.g;
    PA[4] = (Y+0)*this.g;
    PA[5] = (X+2 * 2)*this.g;
    PA[6] = (Y+0)*this.g;
    PA[7] = (X+2 * 2)*this.g;
    PA[8] = (Y+4 * 2)*this.g;
    PA[9] = (X+2 * 2)*this.g;
    PA[10] = (Y+4 * 2)*this.g;
    PA[11] = (X+0)*this.g;
    PA[12] = (Y+4 * 2)*this.g;
    PA[13] = (X+0)*this.g;
    PA[14] = (Y+4 * 2)*this.g;
    PA[15] = (X+0)*this.g;
    PA[16] = (Y+0)*this.g;
    this.lines(4);
  },
  ElementM2(X, Y, Dir) {
    const PA = this.PA;
    PA[1] = (X+0)*this.g;
    PA[2] = (Y+0)*this.g;
    PA[3] = (X+6 * 2)*this.g;
    PA[4] = (Y+0)*this.g;
    PA[5] = (X+6 * 2)*this.g;
    PA[6] = (Y+0)*this.g;
    PA[7] = (X+6 * 2)*this.g;
    PA[8] = (Y+4 * 2)*this.g;
    PA[9] = (X+6 * 2)*this.g;
    PA[10] = (Y+4 * 2)*this.g;
    PA[11] = (X+0)*this.g;
    PA[12] = (Y+4 * 2)*this.g;
    PA[13] = (X+0)*this.g;
    PA[14] = (Y+4 * 2)*this.g;
    PA[15] = (X+0)*this.g;
    PA[16] = (Y+0)*this.g;
    this.lines(4);
  },
  ElementN1(X, Y, Dir) {
    const PA = this.PA;
    switch (Dir) {
    case 1: {
    PA[1] = (X+0)*this.g;
    PA[2] = (Y+0)*this.g;
    PA[3] = (X+0)*this.g;
    PA[4] = (Y+4 * 2)*this.g;
    PA[5] = (X+0)*this.g;
    PA[6] = (Y+0)*this.g;
    PA[7] = (X+4 * 2)*this.g;
    PA[8] = (Y+0)*this.g;
    PA[9] = (X+4 * 2)*this.g;
    PA[10] = (Y+0)*this.g;
    PA[11] = (X+4 * 2)*this.g;
    PA[12] = (Y+4 * 2)*this.g;
    this.lines(3);
    } break;
    case 2: {
    PA[1] = (X+0)*this.g;
    PA[2] = (Y+0)*this.g;
    PA[3] = (X+4 * 2)*this.g;
    PA[4] = (Y+0)*this.g;
    PA[5] = (X+4 * 2)*this.g;
    PA[6] = (Y+0)*this.g;
    PA[7] = (X+4 * 2)*this.g;
    PA[8] = (Y+4 * 2)*this.g;
    PA[9] = (X+4 * 2)*this.g;
    PA[10] = (Y+4 * 2)*this.g;
    PA[11] = (X+0)*this.g;
    PA[12] = (Y+4 * 2)*this.g;
    this.lines(3);
    } break;
    case 3: {
    PA[1] = (X+0)*this.g;
    PA[2] = (Y+0)*this.g;
    PA[3] = (X+0)*this.g;
    PA[4] = (Y+4 * 2)*this.g;
    PA[5] = (X+0)*this.g;
    PA[6] = (Y+4 * 2)*this.g;
    PA[7] = (X+4 * 2)*this.g;
    PA[8] = (Y+4 * 2)*this.g;
    PA[9] = (X+4 * 2)*this.g;
    PA[10] = (Y+4 * 2)*this.g;
    PA[11] = (X+4 * 2)*this.g;
    PA[12] = (Y+0)*this.g;
    this.lines(3);
    } break;
    case 4: {
    PA[1] = (X+0)*this.g;
    PA[2] = (Y+0)*this.g;
    PA[3] = (X+4 * 2)*this.g;
    PA[4] = (Y+0)*this.g;
    PA[5] = (X+0)*this.g;
    PA[6] = (Y+0)*this.g;
    PA[7] = (X+0)*this.g;
    PA[8] = (Y+4 * 2)*this.g;
    PA[9] = (X+0)*this.g;
    PA[10] = (Y+4 * 2)*this.g;
    PA[11] = (X+4 * 2)*this.g;
    PA[12] = (Y+4 * 2)*this.g;
    this.lines(3);
    } break;
    }
  },
  ElementN2(X, Y, Dir) {
    const PA = this.PA;
    switch (Dir) {
    case 1: {
    PA[1] = Math.trunc((X+1.5 * 2)*this.g);
    PA[2] = (Y+0)*this.g;
    PA[3] = (X+0)*this.g;
    PA[4] = Math.trunc((Y+1.5 * 2)*this.g);
    PA[5] = (X+0)*this.g;
    PA[6] = Math.trunc((Y+1.5 * 2)*this.g);
    PA[7] = Math.trunc((X+1.5 * 2)*this.g);
    PA[8] = (Y+3 * 2)*this.g;
    PA[9] = Math.trunc((X+1.5 * 2)*this.g);
    PA[10] = (Y+0)*this.g;
    PA[11] = (X+3 * 2)*this.g;
    PA[12] = Math.trunc((Y+1.5 * 2)*this.g);
    this.lines(3);
    } break;
    case 2: {
    PA[1] = Math.trunc((X+1.5 * 2)*this.g);
    PA[2] = (Y+0)*this.g;
    PA[3] = (X+0)*this.g;
    PA[4] = Math.trunc((Y+1.5 * 2)*this.g);
    PA[5] = Math.trunc((X+1.5 * 2)*this.g);
    PA[6] = (Y+0)*this.g;
    PA[7] = (X+3 * 2)*this.g;
    PA[8] = Math.trunc((Y+1.5 * 2)*this.g);
    PA[9] = (X+3 * 2)*this.g;
    PA[10] = Math.trunc((Y+1.5 * 2)*this.g);
    PA[11] = Math.trunc((X+1.5 * 2)*this.g);
    PA[12] = (Y+3 * 2)*this.g;
    this.lines(3);
    } break;
    case 3: {
    PA[1] = Math.trunc((X+1.5 * 2)*this.g);
    PA[2] = (Y+0)*this.g;
    PA[3] = (X+3 * 2)*this.g;
    PA[4] = Math.trunc((Y+1.5 * 2)*this.g);
    PA[5] = (X+3 * 2)*this.g;
    PA[6] = Math.trunc((Y+1.5 * 2)*this.g);
    PA[7] = Math.trunc((X+1.5 * 2)*this.g);
    PA[8] = (Y+3 * 2)*this.g;
    PA[9] = Math.trunc((X+1.5 * 2)*this.g);
    PA[10] = (Y+3 * 2)*this.g;
    PA[11] = (X+0)*this.g;
    PA[12] = Math.trunc((Y+1.5 * 2)*this.g);
    this.lines(3);
    } break;
    case 4: {
    PA[1] = Math.trunc((X+1.5 * 2)*this.g);
    PA[2] = (Y+0)*this.g;
    PA[3] = (X+0)*this.g;
    PA[4] = Math.trunc((Y+1.5 * 2)*this.g);
    PA[5] = (X+0)*this.g;
    PA[6] = Math.trunc((Y+1.5 * 2)*this.g);
    PA[7] = Math.trunc((X+1.5 * 2)*this.g);
    PA[8] = (Y+3 * 2)*this.g;
    PA[9] = Math.trunc((X+1.5 * 2)*this.g);
    PA[10] = (Y+3 * 2)*this.g;
    PA[11] = (X+3 * 2)*this.g;
    PA[12] = Math.trunc((Y+1.5 * 2)*this.g);
    this.lines(3);
    } break;
    }
  },
  ElementO1(X, Y, Dir) {
    const PA = this.PA;
    switch (Dir) {
    case 1: {
    PA[1] = (X+0)*this.g;
    PA[2] = (Y+0)*this.g;
    PA[3] = (X+0)*this.g;
    PA[4] = (Y+2 * 2)*this.g;
    PA[5] = (X+0)*this.g;
    PA[6] = (Y+0)*this.g;
    PA[7] = (X+4 * 2)*this.g;
    PA[8] = (Y+0)*this.g;
    PA[9] = (X+4 * 2)*this.g;
    PA[10] = (Y+0)*this.g;
    PA[11] = (X+4 * 2)*this.g;
    PA[12] = (Y+2 * 2)*this.g;
    this.lines(3);
    } break;
    case 2: {
    PA[1] = (X+0)*this.g;
    PA[2] = (Y+0)*this.g;
    PA[3] = (X+2 * 2)*this.g;
    PA[4] = (Y+0)*this.g;
    PA[5] = (X+2 * 2)*this.g;
    PA[6] = (Y+0)*this.g;
    PA[7] = (X+2 * 2)*this.g;
    PA[8] = (Y+4 * 2)*this.g;
    PA[9] = (X+2 * 2)*this.g;
    PA[10] = (Y+4 * 2)*this.g;
    PA[11] = (X+0)*this.g;
    PA[12] = (Y+4 * 2)*this.g;
    this.lines(3);
    } break;
    case 3: {
    PA[1] = (X+0)*this.g;
    PA[2] = (Y+0)*this.g;
    PA[3] = (X+0)*this.g;
    PA[4] = (Y+2 * 2)*this.g;
    PA[5] = (X+0)*this.g;
    PA[6] = (Y+2 * 2)*this.g;
    PA[7] = (X+4 * 2)*this.g;
    PA[8] = (Y+2 * 2)*this.g;
    PA[9] = (X+4 * 2)*this.g;
    PA[10] = (Y+2 * 2)*this.g;
    PA[11] = (X+4 * 2)*this.g;
    PA[12] = (Y+0)*this.g;
    this.lines(3);
    } break;
    case 4: {
    PA[1] = (X+0)*this.g;
    PA[2] = (Y+0)*this.g;
    PA[3] = (X+2 * 2)*this.g;
    PA[4] = (Y+0)*this.g;
    PA[5] = (X+0)*this.g;
    PA[6] = (Y+0)*this.g;
    PA[7] = (X+0)*this.g;
    PA[8] = (Y+4 * 2)*this.g;
    PA[9] = (X+0)*this.g;
    PA[10] = (Y+4 * 2)*this.g;
    PA[11] = (X+2 * 2)*this.g;
    PA[12] = (Y+4 * 2)*this.g;
    this.lines(3);
    } break;
    }
  },
  ElementO2(X, Y, Dir) {
    const PA = this.PA;
    switch (Dir) {
    case 1: {
    PA[1] = (X+0)*this.g;
    PA[2] = (Y+0)*this.g;
    PA[3] = (X+0)*this.g;
    PA[4] = (Y+4 * 2)*this.g;
    PA[5] = (X+0)*this.g;
    PA[6] = (Y+0)*this.g;
    PA[7] = (X+2 * 2)*this.g;
    PA[8] = (Y+0)*this.g;
    PA[9] = (X+2 * 2)*this.g;
    PA[10] = (Y+0)*this.g;
    PA[11] = (X+2 * 2)*this.g;
    PA[12] = (Y+4 * 2)*this.g;
    this.lines(3);
    } break;
    case 2: {
    PA[1] = (X+0)*this.g;
    PA[2] = (Y+0)*this.g;
    PA[3] = (X+4 * 2)*this.g;
    PA[4] = (Y+0)*this.g;
    PA[5] = (X+4 * 2)*this.g;
    PA[6] = (Y+0)*this.g;
    PA[7] = (X+4 * 2)*this.g;
    PA[8] = (Y+2 * 2)*this.g;
    PA[9] = (X+4 * 2)*this.g;
    PA[10] = (Y+2 * 2)*this.g;
    PA[11] = (X+0)*this.g;
    PA[12] = (Y+2 * 2)*this.g;
    this.lines(3);
    } break;
    case 3: {
    PA[1] = (X+0)*this.g;
    PA[2] = (Y+0)*this.g;
    PA[3] = (X+0)*this.g;
    PA[4] = (Y+4 * 2)*this.g;
    PA[5] = (X+0)*this.g;
    PA[6] = (Y+4 * 2)*this.g;
    PA[7] = (X+2 * 2)*this.g;
    PA[8] = (Y+4 * 2)*this.g;
    PA[9] = (X+2 * 2)*this.g;
    PA[10] = (Y+4 * 2)*this.g;
    PA[11] = (X+2 * 2)*this.g;
    PA[12] = (Y+0)*this.g;
    this.lines(3);
    } break;
    case 4: {
    PA[1] = (X+0)*this.g;
    PA[2] = (Y+0)*this.g;
    PA[3] = (X+4 * 2)*this.g;
    PA[4] = (Y+0)*this.g;
    PA[5] = (X+0)*this.g;
    PA[6] = (Y+0)*this.g;
    PA[7] = (X+0)*this.g;
    PA[8] = (Y+2 * 2)*this.g;
    PA[9] = (X+0)*this.g;
    PA[10] = (Y+2 * 2)*this.g;
    PA[11] = (X+4 * 2)*this.g;
    PA[12] = (Y+2 * 2)*this.g;
    this.lines(3);
    } break;
    }
  },
  ElementP1(X, Y, Dir) {
    const PA = this.PA;
    switch (Dir) {
    case 1: {
    PA[1] = (X+0)*this.g;
    PA[2] = (Y+2 * 2)*this.g;
    PA[3] = (X+2 * 2)*this.g;
    PA[4] = (Y+0)*this.g;
    PA[5] = (X+2 * 2)*this.g;
    PA[6] = (Y+0)*this.g;
    PA[7] = (X+4 * 2)*this.g;
    PA[8] = (Y+2 * 2)*this.g;
    PA[9] = (X+4 * 2)*this.g;
    PA[10] = (Y+2 * 2)*this.g;
    PA[11] = (X+0)*this.g;
    PA[12] = (Y+2 * 2)*this.g;
    this.lines(3);
    } break;
    case 2: {
    PA[1] = (X+0)*this.g;
    PA[2] = (Y+0)*this.g;
    PA[3] = (X+0)*this.g;
    PA[4] = (Y+4 * 2)*this.g;
    PA[5] = (X+0)*this.g;
    PA[6] = (Y+4 * 2)*this.g;
    PA[7] = (X+2 * 2)*this.g;
    PA[8] = (Y+2 * 2)*this.g;
    PA[9] = (X+2 * 2)*this.g;
    PA[10] = (Y+2 * 2)*this.g;
    PA[11] = (X+0)*this.g;
    PA[12] = (Y+0)*this.g;
    this.lines(3);
    } break;
    case 3: {
    PA[1] = (X+0)*this.g;
    PA[2] = (Y+0)*this.g;
    PA[3] = (X+4 * 2)*this.g;
    PA[4] = (Y+0)*this.g;
    PA[5] = (X+4 * 2)*this.g;
    PA[6] = (Y+0)*this.g;
    PA[7] = (X+2 * 2)*this.g;
    PA[8] = (Y+2 * 2)*this.g;
    PA[9] = (X+2 * 2)*this.g;
    PA[10] = (Y+2 * 2)*this.g;
    PA[11] = (X+0)*this.g;
    PA[12] = (Y+0)*this.g;
    this.lines(3);
    } break;
    case 4: {
    PA[1] = (X+2 * 2)*this.g;
    PA[2] = (Y+0)*this.g;
    PA[3] = (X+2 * 2)*this.g;
    PA[4] = (Y+4 * 2)*this.g;
    PA[5] = (X+2 * 2)*this.g;
    PA[6] = (Y+4 * 2)*this.g;
    PA[7] = (X+0)*this.g;
    PA[8] = (Y+2 * 2)*this.g;
    PA[9] = (X+0)*this.g;
    PA[10] = (Y+2 * 2)*this.g;
    PA[11] = (X+2 * 2)*this.g;
    PA[12] = (Y+0)*this.g;
    this.lines(3);
    } break;
    }
  },
  ElementP2(X, Y, Dir) {
    const PA = this.PA;
    switch (Dir) {
    case 1: {
    PA[1] = (X+0)*this.g;
    PA[2] = (Y+0)*this.g;
    PA[3] = (X+4 * 2)*this.g;
    PA[4] = (Y+0)*this.g;
    PA[5] = (X+4 * 2)*this.g;
    PA[6] = (Y+0)*this.g;
    PA[7] = (X+0)*this.g;
    PA[8] = (Y+4 * 2)*this.g;
    PA[9] = (X+0)*this.g;
    PA[10] = (Y+4 * 2)*this.g;
    PA[11] = (X+0)*this.g;
    PA[12] = (Y+0)*this.g;
    this.lines(3);
    } break;
    case 2: {
    PA[1] = (X+0)*this.g;
    PA[2] = (Y+0)*this.g;
    PA[3] = (X+4 * 2)*this.g;
    PA[4] = (Y+0)*this.g;
    PA[5] = (X+4 * 2)*this.g;
    PA[6] = (Y+0)*this.g;
    PA[7] = (X+4 * 2)*this.g;
    PA[8] = (Y+4 * 2)*this.g;
    PA[9] = (X+4 * 2)*this.g;
    PA[10] = (Y+4 * 2)*this.g;
    PA[11] = (X+0)*this.g;
    PA[12] = (Y+0)*this.g;
    this.lines(3);
    } break;
    case 3: {
    PA[1] = (X+4 * 2)*this.g;
    PA[2] = (Y+0)*this.g;
    PA[3] = (X+4 * 2)*this.g;
    PA[4] = (Y+4 * 2)*this.g;
    PA[5] = (X+4 * 2)*this.g;
    PA[6] = (Y+4 * 2)*this.g;
    PA[7] = (X+0)*this.g;
    PA[8] = (Y+4 * 2)*this.g;
    PA[9] = (X+0)*this.g;
    PA[10] = (Y+4 * 2)*this.g;
    PA[11] = (X+4 * 2)*this.g;
    PA[12] = (Y+0)*this.g;
    this.lines(3);
    } break;
    case 4: {
    PA[1] = (X+0)*this.g;
    PA[2] = (Y+0)*this.g;
    PA[3] = (X+4 * 2)*this.g;
    PA[4] = (Y+4 * 2)*this.g;
    PA[5] = (X+4 * 2)*this.g;
    PA[6] = (Y+4 * 2)*this.g;
    PA[7] = (X+0)*this.g;
    PA[8] = (Y+4 * 2)*this.g;
    PA[9] = (X+0)*this.g;
    PA[10] = (Y+4 * 2)*this.g;
    PA[11] = (X+0)*this.g;
    PA[12] = (Y+0)*this.g;
    this.lines(3);
    } break;
    }
  },
  ElementP3(X, Y, Dir) {
    const PA = this.PA;
    switch (Dir) {
    case 1: {
    PA[1] = (X+0)*this.g;
    PA[2] = (Y+0)*this.g;
    PA[3] = (X+2 * 2)*this.g;
    PA[4] = (Y+0)*this.g;
    PA[5] = (X+2 * 2)*this.g;
    PA[6] = (Y+0)*this.g;
    PA[7] = (X+0)*this.g;
    PA[8] = (Y+2 * 2)*this.g;
    PA[9] = (X+0)*this.g;
    PA[10] = (Y+2 * 2)*this.g;
    PA[11] = (X+0)*this.g;
    PA[12] = (Y+0)*this.g;
    this.lines(3);
    } break;
    case 2: {
    PA[1] = (X+0)*this.g;
    PA[2] = (Y+0)*this.g;
    PA[3] = (X+2 * 2)*this.g;
    PA[4] = (Y+0)*this.g;
    PA[5] = (X+2 * 2)*this.g;
    PA[6] = (Y+0)*this.g;
    PA[7] = (X+2 * 2)*this.g;
    PA[8] = (Y+2 * 2)*this.g;
    PA[9] = (X+2 * 2)*this.g;
    PA[10] = (Y+2 * 2)*this.g;
    PA[11] = (X+0)*this.g;
    PA[12] = (Y+0)*this.g;
    this.lines(3);
    } break;
    case 3: {
    PA[1] = (X+2 * 2)*this.g;
    PA[2] = (Y+0)*this.g;
    PA[3] = (X+2 * 2)*this.g;
    PA[4] = (Y+2 * 2)*this.g;
    PA[5] = (X+2 * 2)*this.g;
    PA[6] = (Y+2 * 2)*this.g;
    PA[7] = (X+0)*this.g;
    PA[8] = (Y+2 * 2)*this.g;
    PA[9] = (X+0)*this.g;
    PA[10] = (Y+2 * 2)*this.g;
    PA[11] = (X+2 * 2)*this.g;
    PA[12] = (Y+0)*this.g;
    this.lines(3);
    } break;
    case 4: {
    PA[1] = (X+0)*this.g;
    PA[2] = (Y+0)*this.g;
    PA[3] = (X+2 * 2)*this.g;
    PA[4] = (Y+2 * 2)*this.g;
    PA[5] = (X+2 * 2)*this.g;
    PA[6] = (Y+2 * 2)*this.g;
    PA[7] = (X+0)*this.g;
    PA[8] = (Y+2 * 2)*this.g;
    PA[9] = (X+0)*this.g;
    PA[10] = (Y+2 * 2)*this.g;
    PA[11] = (X+0)*this.g;
    PA[12] = (Y+0)*this.g;
    this.lines(3);
    } break;
    }
  },
  ElementQ1(X, Y, Dir) {
    const PA = this.PA;
    let x1, x2, y1, y2;
    x1 = X * this.g - 1 + this.ox;
    y1 = Y * this.g - 1 + this.oy;
    x2 = X * this.g + 1 + this.ox;
    y2 = Y * this.g + 1 + this.oy;
    this.ellipse(x1, y1, x2, y2);
  },
  ElementQ2(X, Y, Dir) {
    const PA = this.PA;
    PA[1] = Math.trunc((X + 0.49 * 2)*this.g);
    PA[2] = Math.trunc((Y + 0.5 * 2)*this.g);
    PA[3] = Math.trunc((X+ 0.51 * 2)*this.g);
    PA[4] = Math.trunc((Y+ 0.5 * 2)*this.g);
    this.lines(1);
  },
  ElementR1(X, Y, Dir) {
    const PA = this.PA;
    switch (Dir) {
    case 1: {
    PA[1] = (X+0)*this.g;
    PA[2] = (Y+2 * 2)*this.g;
    PA[3] = (X+2 * 2)*this.g;
    PA[4] = (Y+0)*this.g;
    PA[5] = (X+2 * 2)*this.g;
    PA[6] = (Y+0)*this.g;
    PA[7] = (X+4 * 2)*this.g;
    PA[8] = (Y+2 * 2)*this.g;
    this.lines(2);
    } break;
    case 2: {
    PA[1] = (X+0)*this.g;
    PA[2] = (Y+0)*this.g;
    PA[3] = (X+2 * 2)*this.g;
    PA[4] = (Y+2 * 2)*this.g;
    PA[5] = (X+2 * 2)*this.g;
    PA[6] = (Y+2 * 2)*this.g;
    PA[7] = (X+0)*this.g;
    PA[8] = (Y+4 * 2)*this.g;
    this.lines(2);
    } break;
    case 3: {
    PA[1] = (X+0)*this.g;
    PA[2] = (Y+0)*this.g;
    PA[3] = (X+2 * 2)*this.g;
    PA[4] = (Y+2 * 2)*this.g;
    PA[5] = (X+2 * 2)*this.g;
    PA[6] = (Y+2 * 2)*this.g;
    PA[7] = (X+4 * 2)*this.g;
    PA[8] = (Y+0)*this.g;
    this.lines(2);
    } break;
    case 4: {
    PA[1] = (X+2 * 2)*this.g;
    PA[2] = (Y+0)*this.g;
    PA[3] = (X+0)*this.g;
    PA[4] = (Y+2 * 2)*this.g;
    PA[5] = (X+0)*this.g;
    PA[6] = (Y+2 * 2)*this.g;
    PA[7] = (X+2 * 2)*this.g;
    PA[8] = (Y+4 * 2)*this.g;
    this.lines(2);
    } break;
    }
  },
  ElementR2(X, Y, Dir) {
    const PA = this.PA;
    switch (Dir) {
    case 1: {
    PA[1] = (X+0)*this.g;
    PA[2] = (Y+1 * 2)*this.g;
    PA[3] = (X+1 * 2)*this.g;
    PA[4] = (Y+0)*this.g;
    PA[5] = (X+1 * 2)*this.g;
    PA[6] = (Y+0)*this.g;
    PA[7] = (X+2 * 2)*this.g;
    PA[8] = (Y+1 * 2)*this.g;
    this.lines(2);
    } break;
    case 2: {
    PA[1] = (X+0)*this.g;
    PA[2] = (Y+0)*this.g;
    PA[3] = (X+1 * 2)*this.g;
    PA[4] = (Y+1 * 2)*this.g;
    PA[5] = (X+1 * 2)*this.g;
    PA[6] = (Y+1 * 2)*this.g;
    PA[7] = (X+0)*this.g;
    PA[8] = (Y+2 * 2)*this.g;
    this.lines(2);
    } break;
    case 3: {
    PA[1] = (X+0)*this.g;
    PA[2] = (Y+0)*this.g;
    PA[3] = (X+1 * 2)*this.g;
    PA[4] = (Y+1 * 2)*this.g;
    PA[5] = (X+1 * 2)*this.g;
    PA[6] = (Y+1 * 2)*this.g;
    PA[7] = (X+2 * 2)*this.g;
    PA[8] = (Y+0)*this.g;
    this.lines(2);
    } break;
    case 4: {
    PA[1] = (X+1 * 2)*this.g;
    PA[2] = (Y+0)*this.g;
    PA[3] = (X+0)*this.g;
    PA[4] = (Y+1 * 2)*this.g;
    PA[5] = (X+0)*this.g;
    PA[6] = (Y+1 * 2)*this.g;
    PA[7] = (X+1 * 2)*this.g;
    PA[8] = (Y+2 * 2)*this.g;
    this.lines(2);
    } break;
    }
  },
  ElementR3(X, Y, Dir) {
    const PA = this.PA;
    switch (Dir) {
    case 1: {
    PA[1] = (X+0)*this.g;
    PA[2] = (Y+0)*this.g;
    PA[3] = (X+0)*this.g;
    PA[4] = (Y+1 * 2)*this.g;
    PA[5] = (X+0)*this.g;
    PA[6] = (Y+0)*this.g;
    PA[7] = (X+1 * 2)*this.g;
    PA[8] = (Y+0)*this.g;
    this.lines(2);
    } break;
    case 2: {
    PA[1] = (X+0)*this.g;
    PA[2] = (Y+0)*this.g;
    PA[3] = (X+1 * 2)*this.g;
    PA[4] = (Y+0)*this.g;
    PA[5] = (X+1 * 2)*this.g;
    PA[6] = (Y+0)*this.g;
    PA[7] = (X+1 * 2)*this.g;
    PA[8] = (Y+1 * 2)*this.g;
    this.lines(2);
    } break;
    case 3: {
    PA[1] = (X+1 * 2)*this.g;
    PA[2] = (Y+0)*this.g;
    PA[3] = (X+1 * 2)*this.g;
    PA[4] = (Y+1 * 2)*this.g;
    PA[5] = (X+1 * 2)*this.g;
    PA[6] = (Y+1 * 2)*this.g;
    PA[7] = (X+0)*this.g;
    PA[8] = (Y+1 * 2)*this.g;
    this.lines(2);
    } break;
    case 4: {
    PA[1] = (X+0)*this.g;
    PA[2] = (Y+0)*this.g;
    PA[3] = (X+0)*this.g;
    PA[4] = (Y+1 * 2)*this.g;
    PA[5] = (X+0)*this.g;
    PA[6] = (Y+1 * 2)*this.g;
    PA[7] = (X+1 * 2)*this.g;
    PA[8] = (Y+1 * 2)*this.g;
    this.lines(2);
    } break;
    }
  },
  ElementR4(X, Y, Dir) {
    const PA = this.PA;
    switch (Dir) {
    case 1: {
    PA[1] = (X+0)*this.g;
    PA[2] = (Y+1)*this.g;
    PA[3] = (X+1)*this.g;
    PA[4] = (Y+0)*this.g;
    PA[5] = (X+1)*this.g;
    PA[6] = (Y+0)*this.g;
    PA[7] = (X+2)*this.g;
    PA[8] = (Y+1)*this.g;
    this.lines(2);
    } break;
    case 2: {
    PA[1] = (X+0)*this.g;
    PA[2] = (Y+0)*this.g;
    PA[3] = (X+1)*this.g;
    PA[4] = (Y+1)*this.g;
    PA[5] = (X+1)*this.g;
    PA[6] = (Y+1)*this.g;
    PA[7] = (X+0)*this.g;
    PA[8] = (Y+2)*this.g;
    this.lines(2);
    } break;
    case 3: {
    PA[1] = (X+0)*this.g;
    PA[2] = (Y+0)*this.g;
    PA[3] = (X+1)*this.g;
    PA[4] = (Y+1)*this.g;
    PA[5] = (X+1)*this.g;
    PA[6] = (Y+1)*this.g;
    PA[7] = (X+2)*this.g;
    PA[8] = (Y+0)*this.g;
    this.lines(2);
    } break;
    case 4: {
    PA[1] = (X+1)*this.g;
    PA[2] = (Y+0)*this.g;
    PA[3] = (X+0)*this.g;
    PA[4] = (Y+1)*this.g;
    PA[5] = (X+0)*this.g;
    PA[6] = (Y+1)*this.g;
    PA[7] = (X+1)*this.g;
    PA[8] = (Y+2)*this.g;
    this.lines(2);
    } break;
    }
  },
  ElementS1(X, Y, Dir) {
    const PA = this.PA;
    switch (Dir) {
    case 1: {
    PA[1] = (X+1 * 2)*this.g;
    PA[2] = (Y+0)*this.g;
    PA[3] = (X+1 * 2)*this.g;
    PA[4] = (Y+4 * 2)*this.g;
    PA[5] = (X+0)*this.g;
    PA[6] = (Y+4 * 2)*this.g;
    PA[7] = (X+2 * 2)*this.g;
    PA[8] = (Y+4 * 2)*this.g;
    this.lines(2);
    } break;
    case 2: {
    PA[1] = (X+0)*this.g;
    PA[2] = (Y+1 * 2)*this.g;
    PA[3] = (X+4 * 2)*this.g;
    PA[4] = (Y+1 * 2)*this.g;
    PA[5] = (X+0)*this.g;
    PA[6] = (Y+0)*this.g;
    PA[7] = (X+0)*this.g;
    PA[8] = (Y+2 * 2)*this.g;
    this.lines(2);
    } break;
    case 3: {
    PA[1] = (X+0)*this.g;
    PA[2] = (Y+0)*this.g;
    PA[3] = (X+2 * 2)*this.g;
    PA[4] = (Y+0)*this.g;
    PA[5] = (X+1 * 2)*this.g;
    PA[6] = (Y+0)*this.g;
    PA[7] = (X+1 * 2)*this.g;
    PA[8] = (Y+4 * 2)*this.g;
    this.lines(2);
    } break;
    case 4: {
    PA[1] = (X+0)*this.g;
    PA[2] = (Y+1 * 2)*this.g;
    PA[3] = (X+4 * 2)*this.g;
    PA[4] = (Y+1 * 2)*this.g;
    PA[5] = (X+4 * 2)*this.g;
    PA[6] = (Y+0)*this.g;
    PA[7] = (X+4 * 2)*this.g;
    PA[8] = (Y+2 * 2)*this.g;
    this.lines(2);
    } break;
    }
  },
  ElementS2(X, Y, Dir) {
    const PA = this.PA;
    PA[1] = (X+0)*this.g;
    PA[2] = (Y+4 * 2)*this.g;
    PA[3] = (X+2 * 2)*this.g;
    PA[4] = (Y+4 * 2)*this.g;
    PA[5] = (X+1 * 2)*this.g;
    PA[6] = (Y+4 * 2)*this.g;
    PA[7] = (X+3 * 2)*this.g;
    PA[8] = (Y+0)*this.g;
    this.lines(2);
  },
  ElementS3(X, Y, Dir) {
    const PA = this.PA;
    switch (Dir) {
    case 1: {
    PA[1] = (X+1 * 2)*this.g;
    PA[2] = (Y+0)*this.g;
    PA[3] = (X+1 * 2)*this.g;
    PA[4] = (Y+2 * 2)*this.g;
    PA[5] = (X+0)*this.g;
    PA[6] = (Y+2 * 2)*this.g;
    PA[7] = (X+2 * 2)*this.g;
    PA[8] = (Y+2 * 2)*this.g;
    this.lines(2);
    } break;
    case 2: {
    PA[1] = (X+0)*this.g;
    PA[2] = (Y+1 * 2)*this.g;
    PA[3] = (X+2 * 2)*this.g;
    PA[4] = (Y+1 * 2)*this.g;
    PA[5] = (X+0)*this.g;
    PA[6] = (Y+0)*this.g;
    PA[7] = (X+0)*this.g;
    PA[8] = (Y+2 * 2)*this.g;
    this.lines(2);
    } break;
    case 3: {
    PA[1] = (X+0)*this.g;
    PA[2] = (Y+0)*this.g;
    PA[3] = (X+2 * 2)*this.g;
    PA[4] = (Y+0)*this.g;
    PA[5] = (X+1 * 2)*this.g;
    PA[6] = (Y+0)*this.g;
    PA[7] = (X+1 * 2)*this.g;
    PA[8] = (Y+2 * 2)*this.g;
    this.lines(2);
    } break;
    case 4: {
    PA[1] = (X+0)*this.g;
    PA[2] = (Y+1 * 2)*this.g;
    PA[3] = (X+2 * 2)*this.g;
    PA[4] = (Y+1 * 2)*this.g;
    PA[5] = (X+2 * 2)*this.g;
    PA[6] = (Y+0)*this.g;
    PA[7] = (X+2 * 2)*this.g;
    PA[8] = (Y+2 * 2)*this.g;
    this.lines(2);
    } break;
    }
  },
  ElementS4(X, Y, Dir) {
    const PA = this.PA;
    PA[1] = (X+2 * 2)*this.g;
    PA[2] = (Y+0)*this.g;
    PA[3] = (X+4 * 2)*this.g;
    PA[4] = (Y+2 * 2)*this.g;
    PA[5] = (X+3 * 2)*this.g;
    PA[6] = (Y+1 * 2)*this.g;
    PA[7] = (X+0)*this.g;
    PA[8] = (Y+4 * 2)*this.g;
    this.lines(2);
  },
  ElementT1(X, Y, Dir) {
    const PA = this.PA;
    PA[1] = (X+0)*this.g;
    PA[2] = (Y+2 * 2)*this.g;
    PA[3] = (X+4 * 2)*this.g;
    PA[4] = (Y+2 * 2)*this.g;
    PA[5] = (X+2 * 2)*this.g;
    PA[6] = (Y+0)*this.g;
    PA[7] = (X+2 * 2)*this.g;
    PA[8] = (Y+4 * 2)*this.g;
    this.lines(2);
  },
  ElementT2(X, Y, Dir) {
    const PA = this.PA;
    PA[1] = (X+0)*this.g;
    PA[2] = (Y+1 * 2)*this.g;
    PA[3] = (X+2 * 2)*this.g;
    PA[4] = (Y+1 * 2)*this.g;
    PA[5] = (X+1 * 2)*this.g;
    PA[6] = (Y+0)*this.g;
    PA[7] = (X+1 * 2)*this.g;
    PA[8] = (Y+2 * 2)*this.g;
    this.lines(2);
  },
  ElementT3(X, Y, Dir) {
    const PA = this.PA;
    PA[1] = (X+0)*this.g;
    PA[2] = (Y+0)*this.g;
    PA[3] = (X+4 * 2)*this.g;
    PA[4] = (Y+4 * 2)*this.g;
    PA[5] = (X+4 * 2)*this.g;
    PA[6] = (Y+0)*this.g;
    PA[7] = (X+0)*this.g;
    PA[8] = (Y+4 * 2)*this.g;
    this.lines(2);
  },
  ElementT4(X, Y, Dir) {
    const PA = this.PA;
    PA[1] = (X+0)*this.g;
    PA[2] = (Y+0)*this.g;
    PA[3] = (X+2 * 2)*this.g;
    PA[4] = (Y+2 * 2)*this.g;
    PA[5] = (X+2 * 2)*this.g;
    PA[6] = (Y+0)*this.g;
    PA[7] = (X+0)*this.g;
    PA[8] = (Y+2 * 2)*this.g;
    this.lines(2);
  },
  ElementT5(X, Y, Dir) {
    const PA = this.PA;
    PA[1] = (X+0)*this.g;
    PA[2] = (Y+0)*this.g;
    PA[3] = (X+1 * 2)*this.g;
    PA[4] = (Y+1 * 2)*this.g;
    PA[5] = (X+1 * 2)*this.g;
    PA[6] = (Y+0)*this.g;
    PA[7] = (X+0)*this.g;
    PA[8] = (Y+1 * 2)*this.g;
    this.lines(2);
  },
  ElementT6(X, Y, Dir) {
    const PA = this.PA;
    PA[1] = Math.trunc((X+0.5 * 2)*this.g);
    PA[2] = (Y+0)*this.g;
    PA[3] = Math.trunc((X+1.5 * 2)*this.g);
    PA[4] = (Y+1 * 2)*this.g;
    PA[5] = Math.trunc((X+1.5 * 2)*this.g);
    PA[6] = (Y+0)*this.g;
    PA[7] = Math.trunc((X+0.5 * 2)*this.g);
    PA[8] = (Y+1 * 2)*this.g;
    this.lines(2);
  },
  ElementU1(X, Y, Dir) {
    const PA = this.PA;
    switch (Dir) {
    case 1: {
    PA[1] = (X+2 * 2)*this.g;
    PA[2] = (Y+0)*this.g;
    PA[3] = (X+4 * 2)*this.g;
    PA[4] = (Y+4 * 2)*this.g;
    PA[5] = (X+4 * 2)*this.g;
    PA[6] = (Y+4 * 2)*this.g;
    PA[7] = (X+0)*this.g;
    PA[8] = (Y+4 * 2)*this.g;
    PA[9] = (X+0)*this.g;
    PA[10] = (Y+4 * 2)*this.g;
    PA[11] = (X+2 * 2)*this.g;
    PA[12] = (Y+0)*this.g;
    this.lines(3);
    } break;
    case 2: {
    PA[1] = (X+0)*this.g;
    PA[2] = (Y+0)*this.g;
    PA[3] = (X+0)*this.g;
    PA[4] = (Y+4 * 2)*this.g;
    PA[5] = (X+0)*this.g;
    PA[6] = (Y+0)*this.g;
    PA[7] = (X+4 * 2)*this.g;
    PA[8] = (Y+2 * 2)*this.g;
    PA[9] = (X+4 * 2)*this.g;
    PA[10] = (Y+2 * 2)*this.g;
    PA[11] = (X+0)*this.g;
    PA[12] = (Y+4 * 2)*this.g;
    this.lines(3);
    } break;
    case 3: {
    PA[1] = (X+0)*this.g;
    PA[2] = (Y+0)*this.g;
    PA[3] = (X+4 * 2)*this.g;
    PA[4] = (Y+0)*this.g;
    PA[5] = (X+4 * 2)*this.g;
    PA[6] = (Y+0)*this.g;
    PA[7] = (X+2 * 2)*this.g;
    PA[8] = (Y+4 * 2)*this.g;
    PA[9] = (X+2 * 2)*this.g;
    PA[10] = (Y+4 * 2)*this.g;
    PA[11] = (X+0)*this.g;
    PA[12] = (Y+0)*this.g;
    this.lines(3);
    } break;
    case 4: {
    PA[1] = (X+4 * 2)*this.g;
    PA[2] = (Y+0)*this.g;
    PA[3] = (X+4 * 2)*this.g;
    PA[4] = (Y+4 * 2)*this.g;
    PA[5] = (X+4 * 2)*this.g;
    PA[6] = (Y+4 * 2)*this.g;
    PA[7] = (X+0)*this.g;
    PA[8] = (Y+2 * 2)*this.g;
    PA[9] = (X+0)*this.g;
    PA[10] = (Y+2 * 2)*this.g;
    PA[11] = (X+4 * 2)*this.g;
    PA[12] = (Y+0)*this.g;
    this.lines(3);
    } break;
    }
  },
  ElementU2(X, Y, Dir) {
    const PA = this.PA;
    switch (Dir) {
    case 1: {
    PA[1] = (X+1 * 2)*this.g;
    PA[2] = (Y+0)*this.g;
    PA[3] = (X+2 * 2)*this.g;
    PA[4] = (Y+2 * 2)*this.g;
    PA[5] = (X+2 * 2)*this.g;
    PA[6] = (Y+2 * 2)*this.g;
    PA[7] = (X+0)*this.g;
    PA[8] = (Y+2 * 2)*this.g;
    PA[9] = (X+0)*this.g;
    PA[10] = (Y+2 * 2)*this.g;
    PA[11] = (X+1 * 2)*this.g;
    PA[12] = (Y+0)*this.g;
    this.lines(3);
    } break;
    case 2: {
    PA[1] = (X+0)*this.g;
    PA[2] = (Y+0)*this.g;
    PA[3] = (X+0)*this.g;
    PA[4] = (Y+2 * 2)*this.g;
    PA[5] = (X+0)*this.g;
    PA[6] = (Y+0)*this.g;
    PA[7] = (X+2 * 2)*this.g;
    PA[8] = (Y+1 * 2)*this.g;
    PA[9] = (X+2 * 2)*this.g;
    PA[10] = (Y+1 * 2)*this.g;
    PA[11] = (X+0)*this.g;
    PA[12] = (Y+2 * 2)*this.g;
    this.lines(3);
    } break;
    case 3: {
    PA[1] = (X+0)*this.g;
    PA[2] = (Y+0)*this.g;
    PA[3] = (X+2 * 2)*this.g;
    PA[4] = (Y+0)*this.g;
    PA[5] = (X+2 * 2)*this.g;
    PA[6] = (Y+0)*this.g;
    PA[7] = (X+1 * 2)*this.g;
    PA[8] = (Y+2 * 2)*this.g;
    PA[9] = (X+1 * 2)*this.g;
    PA[10] = (Y+2 * 2)*this.g;
    PA[11] = (X+0)*this.g;
    PA[12] = (Y+0)*this.g;
    this.lines(3);
    } break;
    case 4: {
    PA[1] = (X+2 * 2)*this.g;
    PA[2] = (Y+0)*this.g;
    PA[3] = (X+2 * 2)*this.g;
    PA[4] = (Y+2 * 2)*this.g;
    PA[5] = (X+2 * 2)*this.g;
    PA[6] = (Y+2 * 2)*this.g;
    PA[7] = (X+0)*this.g;
    PA[8] = (Y+1 * 2)*this.g;
    PA[9] = (X+0)*this.g;
    PA[10] = (Y+1 * 2)*this.g;
    PA[11] = (X+2 * 2)*this.g;
    PA[12] = (Y+0)*this.g;
    this.lines(3);
    } break;
    }
  },
  ElementV1(X, Y, Dir) {
    const PA = this.PA;
    switch (Dir) {
    case 1: {
    PA[1] = (X+0)*this.g;
    PA[2] = (Y+4 * 2)*this.g;
    PA[3] = (X+2 * 2)*this.g;
    PA[4] = (Y+0)*this.g;
    PA[5] = (X+2 * 2)*this.g;
    PA[6] = (Y+0)*this.g;
    PA[7] = (X+4 * 2)*this.g;
    PA[8] = (Y+4 * 2)*this.g;
    this.lines(2);
    } break;
    case 2: {
    PA[1] = (X+0)*this.g;
    PA[2] = (Y+0)*this.g;
    PA[3] = (X+4 * 2)*this.g;
    PA[4] = (Y+2 * 2)*this.g;
    PA[5] = (X+4 * 2)*this.g;
    PA[6] = (Y+2 * 2)*this.g;
    PA[7] = (X+0)*this.g;
    PA[8] = (Y+4 * 2)*this.g;
    this.lines(2);
    } break;
    case 3: {
    PA[1] = (X+0)*this.g;
    PA[2] = (Y+0)*this.g;
    PA[3] = (X+2 * 2)*this.g;
    PA[4] = (Y+4 * 2)*this.g;
    PA[5] = (X+2 * 2)*this.g;
    PA[6] = (Y+4 * 2)*this.g;
    PA[7] = (X+4 * 2)*this.g;
    PA[8] = (Y+0)*this.g;
    this.lines(2);
    } break;
    case 4: {
    PA[1] = (X+4 * 2)*this.g;
    PA[2] = (Y+0)*this.g;
    PA[3] = (X+0)*this.g;
    PA[4] = (Y+2 * 2)*this.g;
    PA[5] = (X+0)*this.g;
    PA[6] = (Y+2 * 2)*this.g;
    PA[7] = (X+4 * 2)*this.g;
    PA[8] = (Y+4 * 2)*this.g;
    this.lines(2);
    } break;
    }
  },
  ElementV2(X, Y, Dir) {
    const PA = this.PA;
    switch (Dir) {
    case 1: {
    PA[1] = (X+0)*this.g;
    PA[2] = (Y+2 * 2)*this.g;
    PA[3] = (X+1 * 2)*this.g;
    PA[4] = (Y+0)*this.g;
    PA[5] = (X+1 * 2)*this.g;
    PA[6] = (Y+0)*this.g;
    PA[7] = (X+2 * 2)*this.g;
    PA[8] = (Y+2 * 2)*this.g;
    this.lines(2);
    } break;
    case 2: {
    PA[1] = (X+0)*this.g;
    PA[2] = (Y+0)*this.g;
    PA[3] = (X+2 * 2)*this.g;
    PA[4] = (Y+1 * 2)*this.g;
    PA[5] = (X+2 * 2)*this.g;
    PA[6] = (Y+1 * 2)*this.g;
    PA[7] = (X+0)*this.g;
    PA[8] = (Y+2 * 2)*this.g;
    this.lines(2);
    } break;
    case 3: {
    PA[1] = (X+0)*this.g;
    PA[2] = (Y+0)*this.g;
    PA[3] = (X+1 * 2)*this.g;
    PA[4] = (Y+2 * 2)*this.g;
    PA[5] = (X+1 * 2)*this.g;
    PA[6] = (Y+2 * 2)*this.g;
    PA[7] = (X+2 * 2)*this.g;
    PA[8] = (Y+0)*this.g;
    this.lines(2);
    } break;
    case 4: {
    PA[1] = (X+2 * 2)*this.g;
    PA[2] = (Y+0)*this.g;
    PA[3] = (X+0)*this.g;
    PA[4] = (Y+1 * 2)*this.g;
    PA[5] = (X+0)*this.g;
    PA[6] = (Y+1 * 2)*this.g;
    PA[7] = (X+2 * 2)*this.g;
    PA[8] = (Y+2 * 2)*this.g;
    this.lines(2);
    } break;
    }
  },
  ElementV3(X, Y, Dir) {
    const PA = this.PA;
    switch (Dir) {
    case 1: {
    PA[1] = (X+1 * 2)*this.g;
    PA[2] = (Y+0)*this.g;
    PA[3] = (X+0)*this.g;
    PA[4] = (Y+1 * 2)*this.g;
    PA[5] = (X+1 * 2)*this.g;
    PA[6] = (Y+0)*this.g;
    PA[7] = (X+1 * 2)*this.g;
    PA[8] = (Y+4 * 2)*this.g;
    this.lines(2);
    } break;
    case 2: {
    PA[1] = (X+0)*this.g;
    PA[2] = (Y+1 * 2)*this.g;
    PA[3] = (X+4 * 2)*this.g;
    PA[4] = (Y+1 * 2)*this.g;
    PA[5] = (X+4 * 2)*this.g;
    PA[6] = (Y+1 * 2)*this.g;
    PA[7] = (X+3 * 2)*this.g;
    PA[8] = (Y+0)*this.g;
    this.lines(2);
    } break;
    case 3: {
    PA[1] = (X+0)*this.g;
    PA[2] = (Y+0)*this.g;
    PA[3] = (X+0)*this.g;
    PA[4] = (Y+4 * 2)*this.g;
    PA[5] = (X+0)*this.g;
    PA[6] = (Y+4 * 2)*this.g;
    PA[7] = (X+1 * 2)*this.g;
    PA[8] = (Y+3 * 2)*this.g;
    this.lines(2);
    } break;
    case 4: {
    PA[1] = (X+0)*this.g;
    PA[2] = (Y+0)*this.g;
    PA[3] = (X+4 * 2)*this.g;
    PA[4] = (Y+0)*this.g;
    PA[5] = (X+0)*this.g;
    PA[6] = (Y+0)*this.g;
    PA[7] = (X+1 * 2)*this.g;
    PA[8] = (Y+1 * 2)*this.g;
    this.lines(2);
    } break;
    }
  },
  ElementV4(X, Y, Dir) {
    const PA = this.PA;
    switch (Dir) {
    case 1: {
    PA[1] = (X+0)*this.g;
    PA[2] = (Y+0)*this.g;
    PA[3] = (X+2 * 2)*this.g;
    PA[4] = (Y+0)*this.g;
    PA[5] = (X+2 * 2)*this.g;
    PA[6] = (Y+0)*this.g;
    PA[7] = (X+0)*this.g;
    PA[8] = (Y+2 * 2)*this.g;
    this.lines(2);
    } break;
    case 2: {
    PA[1] = (X+0)*this.g;
    PA[2] = (Y+0)*this.g;
    PA[3] = (X+2 * 2)*this.g;
    PA[4] = (Y+2 * 2)*this.g;
    PA[5] = (X+2 * 2)*this.g;
    PA[6] = (Y+2 * 2)*this.g;
    PA[7] = (X+2 * 2)*this.g;
    PA[8] = (Y+0)*this.g;
    this.lines(2);
    } break;
    case 3: {
    PA[1] = (X+2 * 2)*this.g;
    PA[2] = (Y+0)*this.g;
    PA[3] = (X+0)*this.g;
    PA[4] = (Y+2 * 2)*this.g;
    PA[5] = (X+0)*this.g;
    PA[6] = (Y+2 * 2)*this.g;
    PA[7] = (X+2 * 2)*this.g;
    PA[8] = (Y+2 * 2)*this.g;
    this.lines(2);
    } break;
    case 4: {
    PA[1] = (X+0)*this.g;
    PA[2] = (Y+0)*this.g;
    PA[3] = (X+0)*this.g;
    PA[4] = (Y+2 * 2)*this.g;
    PA[5] = (X+0)*this.g;
    PA[6] = (Y+0)*this.g;
    PA[7] = (X+2 * 2)*this.g;
    PA[8] = (Y+2 * 2)*this.g;
    this.lines(2);
    } break;
    }
  },
  ElementV5(X, Y, Dir) {
    const PA = this.PA;
    switch (Dir) {
    case 1: {
    PA[1] = (X+0)*this.g;
    PA[2] = (Y+1 * 2)*this.g;
    PA[3] = Math.trunc((X+0.5 * 2)*this.g);
    PA[4] = (Y+0)*this.g;
    PA[5] = Math.trunc((X+0.5 * 2)*this.g);
    PA[6] = (Y+0)*this.g;
    PA[7] = (X+1 * 2)*this.g;
    PA[8] = (Y+1 * 2)*this.g;
    this.lines(2);
    } break;
    case 2: {
    PA[1] = (X+0)*this.g;
    PA[2] = (Y+0)*this.g;
    PA[3] = (X+1 * 2)*this.g;
    PA[4] = Math.trunc((Y+0.5 * 2)*this.g);
    PA[5] = (X+1 * 2)*this.g;
    PA[6] = Math.trunc((Y+0.5 * 2)*this.g);
    PA[7] = (X+0)*this.g;
    PA[8] = (Y+1 * 2)*this.g;
    this.lines(2);
    } break;
    case 3: {
    PA[1] = (X+0)*this.g;
    PA[2] = (Y+0)*this.g;
    PA[3] = Math.trunc((X+0.5 * 2)*this.g);
    PA[4] = (Y+1 * 2)*this.g;
    PA[5] = Math.trunc((X+0.5 * 2)*this.g);
    PA[6] = (Y+1 * 2)*this.g;
    PA[7] = (X+1 * 2)*this.g;
    PA[8] = (Y+0)*this.g;
    this.lines(2);
    } break;
    case 4: {
    PA[1] = (X+ 1 * 2)*this.g;
    PA[2] = (Y+0)*this.g;
    PA[3] = (X+0)*this.g;
    PA[4] = Math.trunc((Y+0.5 * 2)*this.g);
    PA[5] = (X+0)*this.g;
    PA[6] = Math.trunc((Y+0.5 * 2)*this.g);
    PA[7] = (X+1 * 2)*this.g;
    PA[8] = (Y+1 * 2)*this.g;
    this.lines(2);
    } break;
    }
  },
  ElementV6(X, Y, Dir) {
    const PA = this.PA;
    switch (Dir) {
    case 1: {
    PA[1] = Math.trunc((X+0.5 * 2)*this.g);
    PA[2] = (Y+1 * 2)*this.g;
    PA[3] = (X+1 * 2)*this.g;
    PA[4] = (Y+0)*this.g;
    PA[5] = (X+1 * 2)*this.g;
    PA[6] = (Y+0)*this.g;
    PA[7] = Math.trunc((X+1.5 * 2)*this.g);
    PA[8] = (Y+1 * 2)*this.g;
    this.lines(2);
    } break;
    case 2: {
    PA[1] = (X+0)*this.g;
    PA[2] = Math.trunc((Y+0.5 * 2)*this.g);
    PA[3] = (X+1 * 2)*this.g;
    PA[4] = (Y+1 * 2)*this.g;
    PA[5] = (X+1 * 2)*this.g;
    PA[6] = (Y+1 * 2)*this.g;
    PA[7] = (X+0)*this.g;
    PA[8] = Math.trunc((Y+1.5 * 2)*this.g);
    this.lines(2);
    } break;
    case 3: {
    PA[1] = Math.trunc((X+0.5 * 2)*this.g);
    PA[2] = (Y+0)*this.g;
    PA[3] = (X+1 * 2)*this.g;
    PA[4] = (Y+1 * 2)*this.g;
    PA[5] = (X+1 * 2)*this.g;
    PA[6] = (Y+1 * 2)*this.g;
    PA[7] = Math.trunc((X+1.5 * 2)*this.g);
    PA[8] = (Y+0)*this.g;
    this.lines(2);
    } break;
    case 4: {
    PA[1] = (X+1 * 2)*this.g;
    PA[2] = Math.trunc((Y+0.5 * 2)*this.g);
    PA[3] = (X+0)*this.g;
    PA[4] = (Y+1 * 2)*this.g;
    PA[5] = (X+0)*this.g;
    PA[6] = (Y+1 * 2)*this.g;
    PA[7] = (X+1 * 2)*this.g;
    PA[8] = Math.trunc((Y+1.5 * 2)*this.g);
    this.lines(2);
    } break;
    }
  },
  ElementV7(X, Y, Dir) {
    const PA = this.PA;
    switch (Dir) {
    case 1: {
    PA[1] = (X+0)*this.g;
    PA[2] = (Y+0)*this.g;
    PA[3] = (X+0)*this.g;
    PA[4] = (Y+2 * 2)*this.g;
    PA[5] = (X+0)*this.g;
    PA[6] = (Y+0)*this.g;
    PA[7] = (X+4 * 2)*this.g;
    PA[8] = (Y+2 * 2)*this.g;
    this.lines(2);
    } break;
    case 2: {
    PA[1] = (X+0)*this.g;
    PA[2] = (Y+0)*this.g;
    PA[3] = (X+2 * 2)*this.g;
    PA[4] = (Y+0)*this.g;
    PA[5] = (X+2 * 2)*this.g;
    PA[6] = (Y+0)*this.g;
    PA[7] = (X+0)*this.g;
    PA[8] = (Y+4 * 2)*this.g;
    this.lines(2);
    } break;
    case 3: {
    PA[1] = (X+0)*this.g;
    PA[2] = (Y+0)*this.g;
    PA[3] = (X+4 * 2)*this.g;
    PA[4] = (Y+2 * 2)*this.g;
    PA[5] = (X+4 * 2)*this.g;
    PA[6] = (Y+2 * 2)*this.g;
    PA[7] = (X+4 * 2)*this.g;
    PA[8] = (Y+0)*this.g;
    this.lines(2);
    } break;
    case 4: {
    PA[1] = (X+2 * 2)*this.g;
    PA[2] = (Y+0)*this.g;
    PA[3] = (X+0)*this.g;
    PA[4] = (Y+4 * 2)*this.g;
    PA[5] = (X+0)*this.g;
    PA[6] = (Y+4 * 2)*this.g;
    PA[7] = (X+2 * 2)*this.g;
    PA[8] = (Y+4 * 2)*this.g;
    this.lines(2);
    } break;
    }
  },
  ElementV8(X, Y, Dir) {
    const PA = this.PA;
    switch (Dir) {
    case 1: {
    PA[1] = (X+0)*this.g;
    PA[2] = (Y+4 * 2)*this.g;
    PA[3] = (X+4 * 2)*this.g;
    PA[4] = (Y+0)*this.g;
    PA[5] = (X+4 * 2)*this.g;
    PA[6] = (Y+0)*this.g;
    PA[7] = (X+4 * 2)*this.g;
    PA[8] = (Y+4 * 2)*this.g;
    this.lines(2);
    } break;
    case 2: {
    PA[1] = (X+0)*this.g;
    PA[2] = (Y+0)*this.g;
    PA[3] = (X+4 * 2)*this.g;
    PA[4] = (Y+4 * 2)*this.g;
    PA[5] = (X+4 * 2)*this.g;
    PA[6] = (Y+4 * 2)*this.g;
    PA[7] = (X+0)*this.g;
    PA[8] = (Y+4 * 2)*this.g;
    this.lines(2);
    } break;
    case 3: {
    PA[1] = (X+0)*this.g;
    PA[2] = (Y+0)*this.g;
    PA[3] = (X+0)*this.g;
    PA[4] = (Y+4 * 2)*this.g;
    PA[5] = (X+0)*this.g;
    PA[6] = (Y+4 * 2)*this.g;
    PA[7] = (X+4 * 2)*this.g;
    PA[8] = (Y+0)*this.g;
    this.lines(2);
    } break;
    case 4: {
    PA[1] = (X+0)*this.g;
    PA[2] = (Y+0)*this.g;
    PA[3] = (X+4 * 2)*this.g;
    PA[4] = (Y+0)*this.g;
    PA[5] = (X+0)*this.g;
    PA[6] = (Y+0)*this.g;
    PA[7] = (X+4 * 2)*this.g;
    PA[8] = (Y+4 * 2)*this.g;
    this.lines(2);
    } break;
    }
  },
  ElementV9(X, Y, Dir) {
    const PA = this.PA;
    switch (Dir) {
    case 1: {
    PA[1] = (X+0)*this.g;
    PA[2] = (Y+0)*this.g;
    PA[3] = (X+0)*this.g;
    PA[4] = (Y+4 * 2)*this.g;
    PA[5] = (X+0)*this.g;
    PA[6] = (Y+0)*this.g;
    PA[7] = (X+2 * 2)*this.g;
    PA[8] = (Y+2 * 2)*this.g;
    this.lines(2);
    } break;
    case 2: {
    PA[1] = (X+0)*this.g;
    PA[2] = (Y+0)*this.g;
    PA[3] = (X+4 * 2)*this.g;
    PA[4] = (Y+0)*this.g;
    PA[5] = (X+4 * 2)*this.g;
    PA[6] = (Y+0)*this.g;
    PA[7] = (X+2 * 2)*this.g;
    PA[8] = (Y+2 * 2)*this.g;
    this.lines(2);
    } break;
    case 3: {
    PA[1] = (X+0)*this.g;
    PA[2] = (Y+2 * 2)*this.g;
    PA[3] = (X+2 * 2)*this.g;
    PA[4] = (Y+4 * 2)*this.g;
    PA[5] = (X+2 * 2)*this.g;
    PA[6] = (Y+4 * 2)*this.g;
    PA[7] = (X+2 * 2)*this.g;
    PA[8] = (Y+0)*this.g;
    this.lines(2);
    } break;
    case 4: {
    PA[1] = (X+2 * 2)*this.g;
    PA[2] = (Y+0)*this.g;
    PA[3] = (X+0)*this.g;
    PA[4] = (Y+2 * 2)*this.g;
    PA[5] = (X+0)*this.g;
    PA[6] = (Y+2 * 2)*this.g;
    PA[7] = (X+4 * 2)*this.g;
    PA[8] = (Y+2 * 2)*this.g;
    this.lines(2);
    } break;
    }
  },
  ElementW1(X, Y, Dir) {
    const PA = this.PA;
    switch (Dir) {
    case 1: {
    PA[1] = (X+0)*this.g;
    PA[2] = (Y+0)*this.g;
    PA[3] = (X+1 * 2)*this.g;
    PA[4] = (Y+0)*this.g;
    this.lines(1);
    } break;
    case 2: {
    PA[1] = (X+0)*this.g;
    PA[2] = (Y+0)*this.g;
    PA[3] = (X+0)*this.g;
    PA[4] = (Y+1 * 2)*this.g;
    this.lines(1);
    } break;
    case 3: {
    PA[1] = (X+0)*this.g;
    PA[2] = (Y+0)*this.g;
    PA[3] = (X+1 * 2)*this.g;
    PA[4] = (Y+0)*this.g;
    this.lines(1);
    } break;
    case 4: {
    PA[1] = (X+0)*this.g;
    PA[2] = (Y+0)*this.g;
    PA[3] = (X+0)*this.g;
    PA[4] = (Y+1 * 2)*this.g;
    this.lines(1);
    } break;
    }
  },
  ElementW2(X, Y, Dir) {
    const PA = this.PA;
    switch (Dir) {
    case 1: {
    PA[1] = (X+0)*this.g;
    PA[2] = (Y+0)*this.g;
    PA[3] = (X+2 * 2)*this.g;
    PA[4] = (Y+0)*this.g;
    this.lines(1);
    } break;
    case 2: {
    PA[1] = (X+0)*this.g;
    PA[2] = (Y+0)*this.g;
    PA[3] = (X+0)*this.g;
    PA[4] = (Y+2 * 2)*this.g;
    this.lines(1);
    } break;
    case 3: {
    PA[1] = (X+0)*this.g;
    PA[2] = (Y+0)*this.g;
    PA[3] = (X+2 * 2)*this.g;
    PA[4] = (Y+0)*this.g;
    this.lines(1);
    } break;
    case 4: {
    PA[1] = (X+0)*this.g;
    PA[2] = (Y+0)*this.g;
    PA[3] = (X+0)*this.g;
    PA[4] = (Y+2 * 2)*this.g;
    this.lines(1);
    } break;
    }
  },
  ElementW3(X, Y, Dir) {
    const PA = this.PA;
    switch (Dir) {
    case 1: {
    PA[1] = (X+0)*this.g;
    PA[2] = (Y+0)*this.g;
    PA[3] = (X+3 * 2)*this.g;
    PA[4] = (Y+0)*this.g;
    this.lines(1);
    } break;
    case 2: {
    PA[1] = (X+0)*this.g;
    PA[2] = (Y+0)*this.g;
    PA[3] = (X+0)*this.g;
    PA[4] = (Y+3 * 2)*this.g;
    this.lines(1);
    } break;
    case 3: {
    PA[1] = (X+0)*this.g;
    PA[2] = (Y+0)*this.g;
    PA[3] = (X+3 * 2)*this.g;
    PA[4] = (Y+0)*this.g;
    this.lines(1);
    } break;
    case 4: {
    PA[1] = (X+0)*this.g;
    PA[2] = (Y+0)*this.g;
    PA[3] = (X+0)*this.g;
    PA[4] = (Y+3 * 2)*this.g;
    this.lines(1);
    } break;
    }
  },
  ElementW4(X, Y, Dir) {
    const PA = this.PA;
    switch (Dir) {
    case 1: {
    PA[1] = (X+0)*this.g;
    PA[2] = (Y+0)*this.g;
    PA[3] = (X+4 * 2)*this.g;
    PA[4] = (Y+0)*this.g;
    this.lines(1);
    } break;
    case 2: {
    PA[1] = (X+0)*this.g;
    PA[2] = (Y+0)*this.g;
    PA[3] = (X+0)*this.g;
    PA[4] = (Y+4 * 2)*this.g;
    this.lines(1);
    } break;
    case 3: {
    PA[1] = (X+0)*this.g;
    PA[2] = (Y+0)*this.g;
    PA[3] = (X+4 * 2)*this.g;
    PA[4] = (Y+0)*this.g;
    this.lines(1);
    } break;
    case 4: {
    PA[1] = (X+0)*this.g;
    PA[2] = (Y+0)*this.g;
    PA[3] = (X+0)*this.g;
    PA[4] = (Y+4 * 2)*this.g;
    this.lines(1);
    } break;
    }
  },
  ElementW5(X, Y, Dir) {
    const PA = this.PA;
    switch (Dir) {
    case 1: {
    PA[1] = (X+0)*this.g;
    PA[2] = (Y+0)*this.g;
    PA[3] = (X+1 * 2)*this.g;
    PA[4] = (Y+1 * 2)*this.g;
    this.lines(1);
    } break;
    case 2: {
    PA[1] = (X+1 * 2)*this.g;
    PA[2] = (Y+0)*this.g;
    PA[3] = (X+0)*this.g;
    PA[4] = (Y+1 * 2)*this.g;
    this.lines(1);
    } break;
    case 3: {
    PA[1] = (X+0)*this.g;
    PA[2] = (Y+0)*this.g;
    PA[3] = (X+1 * 2)*this.g;
    PA[4] = (Y+1 * 2)*this.g;
    this.lines(1);
    } break;
    case 4: {
    PA[1] = (X+1 * 2)*this.g;
    PA[2] = (Y+0)*this.g;
    PA[3] = (X+0)*this.g;
    PA[4] = (Y+1 * 2)*this.g;
    this.lines(1);
    } break;
    }
  },
  ElementW6(X, Y, Dir) {
    const PA = this.PA;
    switch (Dir) {
    case 1: {
    PA[1] = (X+0)*this.g;
    PA[2] = (Y+0)*this.g;
    PA[3] = (X+2 * 2)*this.g;
    PA[4] = (Y+2 * 2)*this.g;
    this.lines(1);
    } break;
    case 2: {
    PA[1] = (X+2 * 2)*this.g;
    PA[2] = (Y+0)*this.g;
    PA[3] = (X+0)*this.g;
    PA[4] = (Y+2 * 2)*this.g;
    this.lines(1);
    } break;
    case 3: {
    PA[1] = (X+0)*this.g;
    PA[2] = (Y+0)*this.g;
    PA[3] = (X+2 * 2)*this.g;
    PA[4] = (Y+2 * 2)*this.g;
    this.lines(1);
    } break;
    case 4: {
    PA[1] = (X+2 * 2)*this.g;
    PA[2] = (Y+0)*this.g;
    PA[3] = (X+0)*this.g;
    PA[4] = (Y+2 * 2)*this.g;
    this.lines(1);
    } break;
    }
  },
  ElementW7(X, Y, Dir) {
    const PA = this.PA;
    switch (Dir) {
    case 1: {
    PA[1] = (X+0)*this.g;
    PA[2] = (Y+0)*this.g;
    PA[3] = (X+3 * 2)*this.g;
    PA[4] = (Y+3 * 2)*this.g;
    this.lines(1);
    } break;
    case 2: {
    PA[1] = (X+3 * 2)*this.g;
    PA[2] = (Y+0)*this.g;
    PA[3] = (X+0)*this.g;
    PA[4] = (Y+3 * 2)*this.g;
    this.lines(1);
    } break;
    case 3: {
    PA[1] = (X+0)*this.g;
    PA[2] = (Y+0)*this.g;
    PA[3] = (X+3 * 2)*this.g;
    PA[4] = (Y+3 * 2)*this.g;
    this.lines(1);
    } break;
    case 4: {
    PA[1] = (X+3 * 2)*this.g;
    PA[2] = (Y+0)*this.g;
    PA[3] = (X+0)*this.g;
    PA[4] = (Y+3 * 2)*this.g;
    this.lines(1);
    } break;
    }
  },
  ElementW8(X, Y, Dir) {
    const PA = this.PA;
    switch (Dir) {
    case 1: {
    PA[1] = (X+0)*this.g;
    PA[2] = (Y+0)*this.g;
    PA[3] = (X+4 * 2)*this.g;
    PA[4] = (Y+4 * 2)*this.g;
    this.lines(1);
    } break;
    case 2: {
    PA[1] = (X+4 * 2)*this.g;
    PA[2] = (Y+0)*this.g;
    PA[3] = (X+0)*this.g;
    PA[4] = (Y+4 * 2)*this.g;
    this.lines(1);
    } break;
    case 3: {
    PA[1] = (X+0)*this.g;
    PA[2] = (Y+0)*this.g;
    PA[3] = (X+4 * 2)*this.g;
    PA[4] = (Y+4 * 2)*this.g;
    this.lines(1);
    } break;
    case 4: {
    PA[1] = (X+4 * 2)*this.g;
    PA[2] = (Y+0)*this.g;
    PA[3] = (X+0)*this.g;
    PA[4] = (Y+4 * 2)*this.g;
    this.lines(1);
    } break;
    }
  },
  ElementW9(X, Y, Dir) {
    const PA = this.PA;
    switch (Dir) {
    case 1: {
    PA[1] = (X+2 * 2)*this.g;
    PA[2] = (Y+0)*this.g;
    PA[3] = (X+0)*this.g;
    PA[4] = (Y+4 * 2)*this.g;
    this.lines(1);
    } break;
    case 2: {
    PA[1] = (X+0)*this.g;
    PA[2] = (Y+0)*this.g;
    PA[3] = (X+4 * 2)*this.g;
    PA[4] = (Y+2 * 2)*this.g;
    this.lines(1);
    } break;
    case 3: {
    PA[1] = (X+0 * 2)*this.g;
    PA[2] = (Y+0)*this.g;
    PA[3] = (X+2 * 2)*this.g;
    PA[4] = (Y+4 * 2)*this.g;
    this.lines(1);
    } break;
    case 4: {
    PA[1] = (X+0)*this.g;
    PA[2] = (Y+2 * 2)*this.g;
    PA[3] = (X+4 * 2)*this.g;
    PA[4] = (Y+0)*this.g;
    this.lines(1);
    } break;
    }
  },
  ElementW10(X, Y, Dir) {
    const PA = this.PA;
    switch (Dir) {
    case 1: {
    PA[1] = (X+1 * 2)*this.g;
    PA[2] = (Y+0)*this.g;
    PA[3] = (X+0)*this.g;
    PA[4] = (Y+2 * 2)*this.g;
    this.lines(1);
    } break;
    case 2: {
    PA[1] = (X+0)*this.g;
    PA[2] = (Y+0)*this.g;
    PA[3] = (X+2 * 2)*this.g;
    PA[4] = (Y+1 * 2)*this.g;
    this.lines(1);
    } break;
    case 3: {
    PA[1] = (X+0 * 2)*this.g;
    PA[2] = (Y+0)*this.g;
    PA[3] = (X+1 * 2)*this.g;
    PA[4] = (Y+2 * 2)*this.g;
    this.lines(1);
    } break;
    case 4: {
    PA[1] = (X+0)*this.g;
    PA[2] = (Y+1 * 2)*this.g;
    PA[3] = (X+2 * 2)*this.g;
    PA[4] = (Y+0)*this.g;
    this.lines(1);
    } break;
    }
  },
  ElementW11(X, Y, Dir) {
    const PA = this.PA;
    switch (Dir) {
    case 1: {
    PA[1] = (X + 0)*this.g;
    PA[2] = Math.trunc((Y + (1 - 0.31) * 2)*this.g);
    PA[3] = Math.trunc((X + (0.31) * 2)*this.g);
    PA[4] = Math.trunc((Y + (1) * 2)*this.g);
    this.lines(1);
    } break;
    case 2: {
    PA[1] = Math.trunc((X + (0.31) * 2)*this.g);
    PA[2] = Math.trunc((Y + (1 - 0.31) * 2)*this.g);
    PA[3] = (X+0)*this.g;
    PA[4] = Math.trunc((Y + (1) * 2)*this.g);
    this.lines(1);
    } break;
    case 3: {
    PA[1] = (X + 0)*this.g;
    PA[2] = Math.trunc((Y + (1 - 0.31) * 2)*this.g);
    PA[3] = Math.trunc((X + (0.31) * 2)*this.g);
    PA[4] = Math.trunc((Y + (1) * 2)*this.g);
    this.lines(1);
    } break;
    case 4: {
    PA[1] = Math.trunc((X + (0.31) * 2)*this.g);
    PA[2] = Math.trunc((Y + (1 - 0.31) * 2)*this.g);
    PA[3] = (X+0)*this.g;
    PA[4] = Math.trunc((Y + (1) * 2)*this.g);
    this.lines(1);
    } break;
    }
  },
  ElementW12(X, Y, Dir) {
    const PA = this.PA;
    switch (Dir) {
    case 1: {
    PA[1] = Math.trunc((X + (1 - 0.31) * 2) *this.g);
    PA[2] = Math.trunc((Y + (1 - 0.31) * 2)*this.g);
    PA[3] = Math.trunc((X + (1) * 2)*this.g);
    PA[4] = Math.trunc((Y + (1) * 2)*this.g);
    this.lines(1);
    } break;
    case 2: {
    PA[1] = Math.trunc((X + (1) * 2)*this.g);
    PA[2] = Math.trunc((Y + (1 - 0.31) * 2)*this.g);
    PA[3] = Math.trunc((X + (1 - 0.31) * 2)*this.g);
    PA[4] = Math.trunc((Y + (1) * 2)*this.g);
    this.lines(1);
    } break;
    case 3: {
    PA[1] = Math.trunc((X + (1 - 0.31) * 2) *this.g);
    PA[2] = Math.trunc((Y + (1 - 0.31) * 2)*this.g);
    PA[3] = Math.trunc((X + (1) * 2)*this.g);
    PA[4] = Math.trunc((Y + (1) * 2)*this.g);
    this.lines(1);
    } break;
    case 4: {
    PA[1] = Math.trunc((X + (1) * 2)*this.g);
    PA[2] = Math.trunc((Y + (1 - 0.31) * 2)*this.g);
    PA[3] = Math.trunc((X + (1 - 0.31) * 2)*this.g);
    PA[4] = Math.trunc((Y + (1) * 2)*this.g);
    this.lines(1);
    } break;
    }
  },
  ElementX1(X, Y, Dir) {
    const PA = this.PA;
    PA[1] = (x1)*this.g;
    PA[2] = (y1)*this.g;
    PA[3] = (x2)*this.g;
    PA[4] = (y2)*this.g;
    this.lines(1);
  },
  ElementY1(X, Y, Dir) {
    const PA = this.PA;
    let rectBottom, rectLeft, rectRight, rectTop, startX, startY, stopX, stopY;
    rectLeft = Math.trunc(X + 0) * this.g;
    rectTop = Math.trunc(Y + 0) * this.g;
    rectRight = Math.trunc(X + 2) * this.g;
    rectBottom = Math.trunc(Y + 2) * this.g;
    startX = (X + 2) * this.g;
    startY = (Y + 1) * this.g;
    stopX = (X + 0) * this.g;
    stopY = (Y + 1) * this.g;
    this.arc(rectLeft + this.ox, rectTop + this.oy, rectRight + this.ox, rectBottom + this.oy, startX + this.ox, startY + this.oy, stopX + this.ox, stopY + this.oy);
    rectLeft = Math.trunc(X + 0) * this.g;
    rectTop = Math.trunc(Y + 2) * this.g;
    rectRight = Math.trunc(X + 2) * this.g;
    rectBottom = Math.trunc(Y + 4) * this.g;
    startX = (X + 0) * this.g;
    startY = (Y + 3) * this.g;
    stopX = (X + 2) * this.g;
    stopY = (Y + 3) * this.g;
    this.arc(rectLeft + this.ox, rectTop + this.oy, rectRight + this.ox, rectBottom + this.oy, startX + this.ox, startY + this.oy, stopX + this.ox, stopY + this.oy);
    PA[1] = (X + 0)*this.g;
    PA[2] = (Y + 1)*this.g;
    PA[3] = (X + 0)*this.g;
    PA[4] = (Y + 3)*this.g;
    PA[5] = (X + 2)*this.g;
    PA[6] = (Y + 1)*this.g;
    PA[7] = (X + 2)*this.g;
    PA[8] = (Y + 3)*this.g;
    this.lines(2);
  },
  ElementY2(X, Y, Dir) {
    const PA = this.PA;
    PA[1] = (X + 1)*this.g;
    PA[2] = (Y + 0)*this.g;
    PA[3] = (X + 1)*this.g;
    PA[4] = (Y + 4)*this.g;
    PA[5] = (X + 0)*this.g;
    PA[6] = (Y + 4)*this.g;
    PA[7] = (X + 2)*this.g;
    PA[8] = (Y + 4)*this.g;
    PA[9] = (X + 0)*this.g;
    PA[10] = (Y + 1)*this.g;
    PA[11] = (X + 1)*this.g;
    PA[12] = (Y + 0)*this.g;
    this.lines(3);
  },
  ElementY3(X, Y, Dir) {
    const PA = this.PA;
    let rectBottom, rectLeft, rectRight, rectTop, startX, startY, stopX, stopY;
    rectLeft = Math.trunc(X + 0) * this.g;
    rectTop = Math.trunc(Y + 0) * this.g;
    rectRight = Math.trunc(X + 2) * this.g;
    rectBottom = Math.trunc(Y + 2) * this.g;
    startX = (X + 2) * this.g;
    startY = (Y + 1) * this.g;
    stopX = (X + 0) * this.g;
    stopY = (Y + 1) * this.g;
    this.arc(rectLeft + this.ox, rectTop + this.oy, rectRight + this.ox, rectBottom + this.oy, startX + this.ox, startY + this.oy, stopX + this.ox, stopY + this.oy);
    PA[1] = (X + 2)*this.g;
    PA[2] = (Y + 1)*this.g;
    PA[3] = (X + 0)*this.g;
    PA[4] = (Y + 4)*this.g;
    PA[5] = (X + 0)*this.g;
    PA[6] = (Y + 4)*this.g;
    PA[7] = (X + 2)*this.g;
    PA[8] = (Y + 4)*this.g;
    this.lines(2);
  },
  ElementY4(X, Y, Dir) {
    const PA = this.PA;
    let rectBottom, rectLeft, rectRight, rectTop, startX, startY, stopX, stopY;
    rectLeft = Math.trunc(X + 0) * this.g;
    rectTop = Math.trunc(Y + 0) * this.g;
    rectRight = Math.trunc(X + 2) * this.g;
    rectBottom = Math.trunc(Y + 2) * this.g;
    startX = (X + 1) * this.g;
    startY = (Y + 2) * this.g;
    stopX = (X + 0) * this.g;
    stopY = (Y + 1) * this.g;
    this.arc(rectLeft + this.ox, rectTop + this.oy, rectRight + this.ox, rectBottom + this.oy, startX + this.ox, startY + this.oy, stopX + this.ox, stopY + this.oy);
    rectLeft = Math.trunc(X + 0) * this.g;
    rectTop = Math.trunc(Y + 2) * this.g;
    rectRight = Math.trunc(X + 2) * this.g;
    rectBottom = Math.trunc(Y + 4) * this.g;
    startX = (X + 0) * this.g;
    startY = (Y + 3) * this.g;
    stopX = (X + 1) * this.g;
    stopY = (Y + 2) * this.g;
    this.arc(rectLeft + this.ox, rectTop + this.oy, rectRight + this.ox, rectBottom + this.oy, startX + this.ox, startY + this.oy, stopX + this.ox, stopY + this.oy);
  },
  ElementY5(X, Y, Dir) {
    const PA = this.PA;
    PA[1] = (X + 0)*this.g;
    PA[2] = (Y + 0)*this.g;
    PA[3] = (X + 0)*this.g;
    PA[4] = (Y + 2)*this.g;
    PA[5] = (X + 0)*this.g;
    PA[6] = (Y + 2)*this.g;
    PA[7] = (X + 2)*this.g;
    PA[8] = (Y + 2)*this.g;
    PA[9] = (X + 2)*this.g;
    PA[10] = (Y + 0)*this.g;
    PA[11] = (X + 2)*this.g;
    PA[12] = (Y + 4)*this.g;
    this.lines(3);
  },
  ElementY6(X, Y, Dir) {
    const PA = this.PA;
    let rectBottom, rectLeft, rectRight, rectTop, startX, startY, stopX, stopY;
    rectLeft = Math.trunc(X + 0) * this.g;
    rectTop = Math.trunc(Y + 2) * this.g;
    rectRight = Math.trunc(X + 2) * this.g;
    rectBottom = Math.trunc(Y + 4) * this.g;
    startX = (X + 1) * this.g;
    startY = (Y + 4) * this.g;
    stopX = (X + 1) * this.g;
    stopY = (Y + 2) * this.g;
    this.arc(rectLeft + this.ox, rectTop + this.oy, rectRight + this.ox, rectBottom + this.oy, startX + this.ox, startY + this.oy, stopX + this.ox, stopY + this.oy);
    PA[1] = (X + 0)*this.g;
    PA[2] = (Y + 0)*this.g;
    PA[3] = (X + 2)*this.g;
    PA[4] = (Y + 0)*this.g;
    PA[5] = (X + 0)*this.g;
    PA[6] = (Y + 0)*this.g;
    PA[7] = (X + 0)*this.g;
    PA[8] = (Y + 2)*this.g;
    PA[9] = (X + 0)*this.g;
    PA[10] = (Y + 2)*this.g;
    PA[11] = (X + 1)*this.g;
    PA[12] = (Y + 2)*this.g;
    PA[13] = (X + 0)*this.g;
    PA[14] = (Y + 4)*this.g;
    PA[15] = (X + 1)*this.g;
    PA[16] = (Y + 4)*this.g;
    this.lines(4);
  },
  ElementY7(X, Y, Dir) {
    const PA = this.PA;
    let rectBottom, rectLeft, rectRight, rectTop, startX, startY, stopX, stopY;
    rectLeft = Math.trunc(X + 0) * this.g;
    rectTop = Math.trunc(Y + 2) * this.g;
    rectRight = Math.trunc(X + 2) * this.g;
    rectBottom = Math.trunc(Y + 4) * this.g;
    startX = (X + 0) * this.g;
    startY = (Y + 3) * this.g;
    stopX = (X + 0) * this.g;
    stopY = (Y + 3) * this.g;
    this.arc(rectLeft + this.ox, rectTop + this.oy, rectRight + this.ox, rectBottom + this.oy, startX + this.ox, startY + this.oy, stopX + this.ox, stopY + this.oy);
    rectLeft = Math.trunc(X + 0) * this.g;
    rectTop = Math.trunc(Y + 0) * this.g;
    rectRight = Math.trunc(X + 2) * this.g;
    rectBottom = Math.trunc(Y + 2) * this.g;
    startX = (X + 2) * this.g;
    startY = (Y + 1) * this.g;
    stopX = (X + 0) * this.g;
    stopY = (Y + 1) * this.g;
    this.arc(rectLeft + this.ox, rectTop + this.oy, rectRight + this.ox, rectBottom + this.oy, startX + this.ox, startY + this.oy, stopX + this.ox, stopY + this.oy);
    PA[1] = (X + 0)*this.g;
    PA[2] = (Y + 3)*this.g;
    PA[3] = (X + 0)*this.g;
    PA[4] = (Y + 1)*this.g;
    this.lines(1);
  },
  ElementY8(X, Y, Dir) {
    const PA = this.PA;
    PA[1] = (X + 0)*this.g;
    PA[2] = (Y + 0)*this.g;
    PA[3] = (X + 2)*this.g;
    PA[4] = (Y + 0)*this.g;
    PA[5] = (X + 2)*this.g;
    PA[6] = (Y + 0)*this.g;
    PA[7] = (X + 1)*this.g;
    PA[8] = (Y + 4)*this.g;
    this.lines(2);
  },
  ElementY9(X, Y, Dir) {
    const PA = this.PA;
    let rectBottom, rectLeft, rectRight, rectTop, startX, startY, stopX, stopY;
    rectLeft = Math.trunc(X + 0) * this.g;
    rectTop = Math.trunc(Y + 0) * this.g;
    rectRight = Math.trunc(X + 2) * this.g;
    rectBottom = Math.trunc(Y + 2) * this.g;
    startX = (X + 0) * this.g;
    startY = (Y + 1) * this.g;
    stopX = (X + 0) * this.g;
    stopY = (Y + 1) * this.g;
    this.arc(rectLeft + this.ox, rectTop + this.oy, rectRight + this.ox, rectBottom + this.oy, startX + this.ox, startY + this.oy, stopX + this.ox, stopY + this.oy);
    rectLeft = Math.trunc(X + 0) * this.g;
    rectTop = Math.trunc(Y + 2) * this.g;
    rectRight = Math.trunc(X + 2) * this.g;
    rectBottom = Math.trunc(Y + 4) * this.g;
    startX = (X + 0) * this.g;
    startY = (Y + 3) * this.g;
    stopX = (X + 0) * this.g;
    stopY = (Y + 3) * this.g;
    this.arc(rectLeft + this.ox, rectTop + this.oy, rectRight + this.ox, rectBottom + this.oy, startX + this.ox, startY + this.oy, stopX + this.ox, stopY + this.oy);
  },
  ElementY10(X, Y, Dir) {
    const PA = this.PA;
    let rectBottom, rectLeft, rectRight, rectTop, startX, startY, stopX, stopY;
    rectLeft = Math.trunc(X + 0) * this.g;
    rectTop = Math.trunc(Y + 0) * this.g;
    rectRight = Math.trunc(X + 2) * this.g;
    rectBottom = Math.trunc(Y + 2) * this.g;
    startX = (X + 0) * this.g;
    startY = (Y + 1) * this.g;
    stopX = (X + 0) * this.g;
    stopY = (Y + 1) * this.g;
    this.arc(rectLeft + this.ox, rectTop + this.oy, rectRight + this.ox, rectBottom + this.oy, startX + this.ox, startY + this.oy, stopX + this.ox, stopY + this.oy);
    rectLeft = Math.trunc(X + 0) * this.g;
    rectTop = Math.trunc(Y + 2) * this.g;
    rectRight = Math.trunc(X + 2) * this.g;
    rectBottom = Math.trunc(Y + 4) * this.g;
    startX = (X + 0) * this.g;
    startY = (Y + 3) * this.g;
    stopX = (X + 2) * this.g;
    stopY = (Y + 3) * this.g;
    this.arc(rectLeft + this.ox, rectTop + this.oy, rectRight + this.ox, rectBottom + this.oy, startX + this.ox, startY + this.oy, stopX + this.ox, stopY + this.oy);
    PA[1] = (X + 2)*this.g;
    PA[2] = (Y + 1)*this.g;
    PA[3] = (X + 2)*this.g;
    PA[4] = (Y + 3)*this.g;
    this.lines(1);
  },
  ElementY11(X, Y, Dir) {
    const PA = this.PA;
    let rectBottom, rectLeft, rectRight, rectTop, startX, startY, stopX, stopY;
    rectLeft = Math.trunc(X + 0) * this.g;
    rectTop = Math.trunc(Y + 0) * this.g;
    rectRight = Math.trunc(X + 1) * this.g;
    rectBottom = Math.trunc(Y + 1) * this.g;
    startX = (X + 1) * this.g;
    startY = Math.trunc((Y + 0.5) * this.g);
    stopX = (X + 0) * this.g;
    stopY = Math.trunc((Y + 0.5) * this.g);
    this.arc(rectLeft + this.ox, rectTop + this.oy, rectRight + this.ox, rectBottom + this.oy, startX + this.ox, startY + this.oy, stopX + this.ox, stopY + this.oy);
    rectLeft = Math.trunc(X + 0) * this.g;
    rectTop = Math.trunc(Y + 1) * this.g;
    rectRight = Math.trunc(X + 1) * this.g;
    rectBottom = Math.trunc(Y + 2) * this.g;
    startX = (X + 0) * this.g;
    startY = Math.trunc((Y + 1.5) * this.g);
    stopX = (X + 1) * this.g;
    stopY = Math.trunc((Y + 1.5) * this.g);
    this.arc(rectLeft + this.ox, rectTop + this.oy, rectRight + this.ox, rectBottom + this.oy, startX + this.ox, startY + this.oy, stopX + this.ox, stopY + this.oy);
    PA[1] = (X + 0)*this.g;
    PA[2] = Math.trunc((Y + 0.5)*this.g);
    PA[3] = (X + 0)*this.g;
    PA[4] = Math.trunc((Y + 1.5)*this.g);
    PA[5] = (X + 1)*this.g;
    PA[6] = Math.trunc((Y + 0.5)*this.g);
    PA[7] = (X + 1)*this.g;
    PA[8] = Math.trunc((Y + 1.5)*this.g);
    this.lines(2);
  },
  ElementY12(X, Y, Dir) {
    const PA = this.PA;
    PA[1] = Math.trunc((X + 0.5)*this.g);
    PA[2] = (Y + 0)*this.g;
    PA[3] = Math.trunc((X + 0.5)*this.g);
    PA[4] = (Y + 2)*this.g;
    PA[5] = (X + 0)*this.g;
    PA[6] = (Y + 2)*this.g;
    PA[7] = (X + 1)*this.g;
    PA[8] = (Y + 2)*this.g;
    PA[9] = (X + 0)*this.g;
    PA[10] = Math.trunc((Y + 0.5)*this.g);
    PA[11] = Math.trunc((X + 0.5)*this.g);
    PA[12] = (Y + 0)*this.g;
    this.lines(3);
  },
  ElementY13(X, Y, Dir) {
    const PA = this.PA;
    let rectBottom, rectLeft, rectRight, rectTop, startX, startY, stopX, stopY;
    rectLeft = Math.trunc(X + 0) * this.g;
    rectTop = Math.trunc(Y + 0) * this.g;
    rectRight = Math.trunc(X + 1) * this.g;
    rectBottom = Math.trunc(Y + 1) * this.g;
    startX = (X + 1) * this.g;
    startY = Math.trunc((Y + 0.5) * this.g);
    stopX = (X + 0) * this.g;
    stopY = Math.trunc((Y + 0.5) * this.g);
    this.arc(rectLeft + this.ox, rectTop + this.oy, rectRight + this.ox, rectBottom + this.oy, startX + this.ox, startY + this.oy, stopX + this.ox, stopY + this.oy);
    PA[1] = (X + 1)*this.g;
    PA[2] = Math.trunc((Y + 0.5)*this.g);
    PA[3] = (X + 0)*this.g;
    PA[4] = (Y + 2)*this.g;
    PA[5] = (X + 0)*this.g;
    PA[6] = (Y + 2)*this.g;
    PA[7] = (X + 1)*this.g;
    PA[8] = (Y + 2)*this.g;
    this.lines(2);
  },
  ElementY14(X, Y, Dir) {
    const PA = this.PA;
    let rectBottom, rectLeft, rectRight, rectTop, startX, startY, stopX, stopY;
    rectLeft = Math.trunc(X + 0) * this.g;
    rectTop = Math.trunc(Y + 0) * this.g;
    rectRight = Math.trunc(X + 1) * this.g;
    rectBottom = Math.trunc(Y + 1) * this.g;
    startX = Math.trunc((X + 0.5) * this.g);
    startY = (Y + 1) * this.g;
    stopX = (X + 0) * this.g;
    stopY = Math.trunc((Y + 0.5) * this.g);
    this.arc(rectLeft + this.ox, rectTop + this.oy, rectRight + this.ox, rectBottom + this.oy, startX + this.ox, startY + this.oy, stopX + this.ox, stopY + this.oy);
    rectLeft = Math.trunc(X + 0) * this.g;
    rectTop = Math.trunc(Y + 1) * this.g;
    rectRight = Math.trunc(X + 1) * this.g;
    rectBottom = Math.trunc(Y + 2) * this.g;
    startX = (X + 0) * this.g;
    startY = Math.trunc((Y + 1.5) * this.g);
    stopX = Math.trunc((X + 0.5) * this.g);
    stopY = (Y + 1) * this.g;
    this.arc(rectLeft + this.ox, rectTop + this.oy, rectRight + this.ox, rectBottom + this.oy, startX + this.ox, startY + this.oy, stopX + this.ox, stopY + this.oy);
  },
  ElementY15(X, Y, Dir) {
    const PA = this.PA;
    PA[1] = (X + 0)*this.g;
    PA[2] = (Y + 0)*this.g;
    PA[3] = (X + 0)*this.g;
    PA[4] = (Y + 1)*this.g;
    PA[5] = (X + 0)*this.g;
    PA[6] = (Y + 1)*this.g;
    PA[7] = (X + 1)*this.g;
    PA[8] = (Y + 1)*this.g;
    PA[9] = (X + 1)*this.g;
    PA[10] = (Y + 0)*this.g;
    PA[11] = (X + 1)*this.g;
    PA[12] = (Y + 2)*this.g;
    this.lines(3);
  },
  ElementY16(X, Y, Dir) {
    const PA = this.PA;
    let rectBottom, rectLeft, rectRight, rectTop, startX, startY, stopX, stopY;
    rectLeft = Math.trunc(X + 0) * this.g;
    rectTop = Math.trunc(Y + 1) * this.g;
    rectRight = Math.trunc(X + 1) * this.g;
    rectBottom = Math.trunc(Y + 2) * this.g;
    startX = Math.trunc((X + 0.5) * this.g);
    startY = (Y + 2) * this.g;
    stopX = Math.trunc((X + 0.5) * this.g);
    stopY = (Y + 1) * this.g;
    this.arc(rectLeft + this.ox, rectTop + this.oy, rectRight + this.ox, rectBottom + this.oy, startX + this.ox, startY + this.oy, stopX + this.ox, stopY + this.oy);
    PA[1] = (X + 0)*this.g;
    PA[2] = (Y + 0)*this.g;
    PA[3] = (X + 1)*this.g;
    PA[4] = (Y + 0)*this.g;
    PA[5] = (X + 0)*this.g;
    PA[6] = (Y + 0)*this.g;
    PA[7] = (X + 0)*this.g;
    PA[8] = (Y + 1)*this.g;
    PA[9] = (X + 0)*this.g;
    PA[10] = (Y + 1)*this.g;
    PA[11] = Math.trunc((X + 0.5)*this.g);
    PA[12] = (Y + 1)*this.g;
    PA[13] = (X + 0)*this.g;
    PA[14] = (Y + 2)*this.g;
    PA[15] = Math.trunc((X + 0.5)*this.g);
    PA[16] = (Y + 2)*this.g;
    this.lines(4);
  },
  ElementY17(X, Y, Dir) {
    const PA = this.PA;
    let rectBottom, rectLeft, rectRight, rectTop, startX, startY, stopX, stopY;
    rectLeft = Math.trunc(X + 0) * this.g;
    rectTop = Math.trunc(Y + 1) * this.g;
    rectRight = Math.trunc(X + 1) * this.g;
    rectBottom = Math.trunc(Y + 2) * this.g;
    startX = (X + 0) * this.g;
    startY = Math.trunc((Y + 1.5) * this.g);
    stopX = (X + 0) * this.g;
    stopY = Math.trunc((Y + 1.5) * this.g);
    this.arc(rectLeft + this.ox, rectTop + this.oy, rectRight + this.ox, rectBottom + this.oy, startX + this.ox, startY + this.oy, stopX + this.ox, stopY + this.oy);
    rectLeft = Math.trunc(X + 0) * this.g;
    rectTop = Math.trunc(Y + 0) * this.g;
    rectRight = Math.trunc(X + 1) * this.g;
    rectBottom = Math.trunc(Y + 1) * this.g;
    startX = (X + 1) * this.g;
    startY = Math.trunc((Y + 0.5) * this.g);
    stopX = (X + 0) * this.g;
    stopY = Math.trunc((Y + 0.5) * this.g);
    this.arc(rectLeft + this.ox, rectTop + this.oy, rectRight + this.ox, rectBottom + this.oy, startX + this.ox, startY + this.oy, stopX + this.ox, stopY + this.oy);
    PA[1] = (X + 0)*this.g;
    PA[2] = Math.trunc((Y + 1.5)*this.g);
    PA[3] = (X + 0)*this.g;
    PA[4] = Math.trunc((Y + 0.5)*this.g);
    this.lines(1);
  },
  ElementY18(X, Y, Dir) {
    const PA = this.PA;
    PA[1] = (X + 0)*this.g;
    PA[2] = (Y + 0)*this.g;
    PA[3] = (X + 1)*this.g;
    PA[4] = (Y + 0)*this.g;
    PA[5] = (X + 1)*this.g;
    PA[6] = (Y + 0)*this.g;
    PA[7] = Math.trunc((X + 0.5)*this.g);
    PA[8] = (Y + 2)*this.g;
    this.lines(2);
  },
  ElementY19(X, Y, Dir) {
    const PA = this.PA;
    let rectBottom, rectLeft, rectRight, rectTop, startX, startY, stopX, stopY;
    rectLeft = Math.trunc(X + 0) * this.g;
    rectTop = Math.trunc(Y + 0) * this.g;
    rectRight = Math.trunc(X + 1) * this.g;
    rectBottom = Math.trunc(Y + 1) * this.g;
    startX = (X + 0) * this.g;
    startY = Math.trunc((Y + 0.5) * this.g);
    stopX = (X + 0) * this.g;
    stopY = Math.trunc((Y + 0.5) * this.g);
    this.arc(rectLeft + this.ox, rectTop + this.oy, rectRight + this.ox, rectBottom + this.oy, startX + this.ox, startY + this.oy, stopX + this.ox, stopY + this.oy);
    rectLeft = Math.trunc(X + 0) * this.g;
    rectTop = Math.trunc(Y + 1) * this.g;
    rectRight = Math.trunc(X + 1) * this.g;
    rectBottom = Math.trunc(Y + 2) * this.g;
    startX = (X + 0) * this.g;
    startY = Math.trunc((Y + 1.5) * this.g);
    stopX = (X + 0) * this.g;
    stopY = Math.trunc((Y + 1.5) * this.g);
    this.arc(rectLeft + this.ox, rectTop + this.oy, rectRight + this.ox, rectBottom + this.oy, startX + this.ox, startY + this.oy, stopX + this.ox, stopY + this.oy);
  },
  ElementY20(X, Y, Dir) {
    const PA = this.PA;
    let rectBottom, rectLeft, rectRight, rectTop, startX, startY, stopX, stopY;
    rectLeft = Math.trunc(X + 0) * this.g;
    rectTop = Math.trunc(Y + 0) * this.g;
    rectRight = Math.trunc(X + 1) * this.g;
    rectBottom = Math.trunc(Y + 1) * this.g;
    startX = (X + 0) * this.g;
    startY = Math.trunc((Y + 0.5) * this.g);
    stopX = (X + 0) * this.g;
    stopY = Math.trunc((Y + 0.5) * this.g);
    this.arc(rectLeft + this.ox, rectTop + this.oy, rectRight + this.ox, rectBottom + this.oy, startX + this.ox, startY + this.oy, stopX + this.ox, stopY + this.oy);
    rectLeft = Math.trunc(X + 0) * this.g;
    rectTop = Math.trunc(Y + 1) * this.g;
    rectRight = Math.trunc(X + 1) * this.g;
    rectBottom = Math.trunc(Y + 2) * this.g;
    startX = (X + 0) * this.g;
    startY = Math.trunc((Y + 1.5) * this.g);
    stopX = (X + 1) * this.g;
    stopY = Math.trunc((Y + 1.5) * this.g);
    this.arc(rectLeft + this.ox, rectTop + this.oy, rectRight + this.ox, rectBottom + this.oy, startX + this.ox, startY + this.oy, stopX + this.ox, stopY + this.oy);
    PA[1] = (X + 1)*this.g;
    PA[2] = Math.trunc((Y + 0.5)*this.g);
    PA[3] = (X + 1)*this.g;
    PA[4] = Math.trunc((Y + 1.5)*this.g);
    this.lines(1);
  },
  ElementY21(X, Y, Dir, Color) {
    const PA = this.PA;
    let rectBottom, rectLeft, rectRight, rectTop, startX, startY, stopX, stopY, x1, x2, y1, y2;
    rectLeft = Math.trunc(X - 2) * this.g;
    rectTop = Math.trunc(Y - 1) * this.g;
    rectRight = Math.trunc(X + 0) * this.g;
    rectBottom = Math.trunc(Y + 1) * this.g;
    startX = Math.trunc((X - 0.4) * this.g);
    startY = Math.trunc((Y + 0.4) * this.g);
    stopX = (X + 1) * this.g;
    stopY = Math.trunc((Y + 0) * this.g);
    this.arc(rectLeft + this.ox, rectTop + this.oy, rectRight + this.ox, rectBottom + this.oy, startX + this.ox, startY + this.oy, stopX + this.ox, stopY + this.oy);
    x1 = Math.trunc((X - 0.4) * this.g) + this.ox;
    y1 = Math.trunc((Y - 0.2) * this.g) + this.oy;
    x2 = Math.trunc((X + 0) * this.g) + this.ox;
    y2 = Math.trunc((Y + 0.2) * this.g) + this.oy;
    
    
    
    this.ellipseFill(x1, y1, x2, y2, Color);
    
  },
  ElementY22(X, Y, Dir, Color) {
    const PA = this.PA;
    let x1, x2, y1, y2;
    PA[1] = (X + 0)* this.g;
    PA[2] = Math.trunc((Y + 0)* this.g);
    PA[3] = (X + 0)* this.g;
    PA[4] = Math.trunc((Y + 3)* this.g);
    this.lines(1);
    x1 = Math.trunc((X - 0) * this.g) - 1 + this.ox;
    y1 = Math.trunc((Y + 4) * this.g) - 2 + this.oy;
    x2 = Math.trunc((X + 0) * this.g) + 1 + this.ox;
    y2 = Math.trunc((Y + 4) * this.g) + 0 + this.oy;
    
    
    
    this.ellipseFill(x1, y1, x2, y2, Color);
    
  },
  ElementY23(X, Y, Dir, Color) {
    const PA = this.PA;
    let x1, x2, y1, y2;
    PA[1] = (X + 0)* this.g;
    PA[2] = Math.trunc((Y + 0)* this.g);
    PA[3] = (X + 0)* this.g;
    PA[4] = Math.trunc((Y + 1)* this.g);
    this.lines(1);
    x1 = Math.trunc((X - 0) * this.g) - 1 + this.ox;
    y1 = Math.trunc((Y + 2) * this.g) - 2 + this.oy;
    x2 = Math.trunc((X + 0) * this.g) + 1 + this.ox;
    y2 = Math.trunc((Y + 2) * this.g) + 0 + this.oy;
    
    
    
    this.ellipseFill(x1, y1, x2, y2, Color);
    
  },
  ElementY24(X, Y, Dir, Color) {
    const PA = this.PA;
    let rectBottom, rectLeft, rectRight, rectTop, startX, startY, stopX, stopY, x1, x2, y1, y2;
    rectLeft = Math.trunc(X + 0) * this.g;
    rectTop = Math.trunc(Y + 0) * this.g;
    rectRight = Math.trunc(X + 2) * this.g;
    rectBottom = Math.trunc(Y + 2) * this.g;
    startX = (X + 1) * this.g;
    startY = Math.trunc((Y + 2) * this.g);
    stopX = (X + 0) * this.g;
    stopY = Math.trunc((Y + 1) * this.g);
    this.arc(rectLeft + this.ox, rectTop + this.oy, rectRight + this.ox, rectBottom + this.oy, startX + this.ox, startY + this.oy, stopX + this.ox, stopY + this.oy);
    PA[1] = (X + 1)* this.g;
    PA[2] = Math.trunc((Y + 2)* this.g);
    PA[3] = (X + 1)* this.g;
    PA[4] = Math.trunc((Y + 3)* this.g);
    this.lines(1);
    x1 = Math.trunc((X + 1) * this.g) - 1 + this.ox;
    y1 = Math.trunc((Y + 4) * this.g) - 2 + this.oy;
    x2 = Math.trunc((X + 1) * this.g) + 1 + this.ox;
    y2 = Math.trunc((Y + 4) * this.g) + 0 + this.oy;
    
    
    
    this.ellipseFill(x1, y1, x2, y2, Color);
    
  },
  ElementY25(X, Y, Dir, Color) {
    const PA = this.PA;
    let rectBottom, rectLeft, rectRight, rectTop, startX, startY, stopX, stopY, x1, x2, y1, y2;
    rectLeft = Math.trunc(X + 0) * this.g;
    rectTop = Math.trunc(Y + 0) * this.g;
    rectRight = Math.trunc(X + 1) * this.g;
    rectBottom = Math.trunc(Y + 1) * this.g;
    startX = Math.trunc((X + 0.5) * this.g);
    startY = Math.trunc((Y + 1) * this.g);
    stopX = (X + 0) * this.g;
    stopY = Math.trunc((Y + 0.5) * this.g);
    this.arc(rectLeft + this.ox, rectTop + this.oy, rectRight + this.ox, rectBottom + this.oy, startX + this.ox, startY + this.oy, stopX + this.ox, stopY + this.oy);
    PA[1] = Math.trunc((X + 0.5)* this.g);
    PA[2] = Math.trunc((Y + 1)* this.g);
    PA[3] = Math.trunc((X + 0.5)* this.g);
    PA[4] = Math.trunc((Y + 1.15)* this.g);
    this.lines(1);
    x1 = Math.trunc((X + 0.5) * this.g) - 1 + this.ox;
    y1 = Math.trunc((Y + 2) * this.g) - 2 + this.oy;
    x2 = Math.trunc((X + 0.5) * this.g) + 1 + this.ox;
    y2 = Math.trunc((Y + 2) * this.g) + 0 + this.oy;
    
    
    
    this.ellipseFill(x1, y1, x2, y2, Color);
    
  }
};
if (typeof module !== "undefined") module.exports = BLISS_SHAPES;
