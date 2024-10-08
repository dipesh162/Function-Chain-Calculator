const validateEquation = (equation: string): boolean => {
    if (equation.trim() === '') return true; // Allow empty strings
    const validOperators = /^[x0-9+\-*/^()\s]+$/;
    let openParentheses = 0;

    // Check for matching parentheses
    for (const char of equation) {
        if (char === '(') openParentheses++;
        if (char === ')') openParentheses--;
        if (openParentheses < 0) return false; // More closing than opening
    }

    return openParentheses === 0 && validOperators.test(equation);
}

export default validateEquation
