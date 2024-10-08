const calculateResult = (x: number, equation: string): number => {
    const sanitizedEquation = equation.replace(/\^/g, '**');

    try {
        return eval(sanitizedEquation.replace(/x/g, x.toString()));
    } catch (error) {
        console.error('Error evaluating equation:', error);
        return 0; // Return a default value or handle error as needed
    }
}

export default calculateResult