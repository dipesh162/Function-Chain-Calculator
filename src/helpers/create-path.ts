const createPath = (startPos: DOMRect, endPos: DOMRect, pathType: string) => {
    const startX = startPos.right - (8);
    const startY = startPos.top + startPos.height / 2  - (-1);
    const endX = endPos.left + (8);
    const endY = endPos.top + endPos.height / 2   - (-1);

    if (pathType === 'quadratic') {
        // Control point for U shape
        const controlX = (startX + endX) / 2;
        const controlY = Math.max(startY, endY) + 50; // Adjust this value to control the depth of the "U"

        // Quadratic Bezier curve
        return `M${startX},${startY} Q${controlX},${controlY} ${endX},${endY}`;
    } else if (pathType === 'cubic') {
        // Control points for S shape
        const control1X = 1029  // First control point on the left
        const control1Y = 556           // Pull up for the "S"
        const control2X = 771 // Second control point on the right
        const control2Y = 525              // Pull down for the "S"

        return `M${startX},${startY} C${control1X},${control1Y} ${control2X},${control2Y} ${endX},${endY}`;
    } else if(pathType === 'bottomTopQuadratic'){
        const controlX = 1264
        const controlY = 571

        // Quadratic Bezier curve
        return `M${startX},${startY} Q${controlX},${controlY} ${endX},${endY}`;              
    }

    return ''; // Fallback if no path type matches
}

export default createPath