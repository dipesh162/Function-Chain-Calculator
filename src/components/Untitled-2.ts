// React
import { useState, useEffect, useCallback, useRef } from 'react';

// Components
import FunctionCard from './FunctionCard';
import InputOutput from './InputOutput.tsx';

type Function = {
    id: number;
    equation: string;
    nextFunction: number | null;
    input: number;
    output: number;
};

const initialFunctions: Function[] = [
    { id: 1, equation: 'x^2', nextFunction: 2, input: 0, output: 0 },
    { id: 2, equation: '2*x+4', nextFunction: 4, input: 0, output: 0 },
    { id: 3, equation: 'x^2+20', nextFunction: null, input: 0, output: 0 },
    { id: 4, equation: 'x-2', nextFunction: 5, input: 0, output: 0 },
    { id: 5, equation: 'x/2', nextFunction: 3, input: 0, output: 0 },
];

const validateEquation = (equation: string): boolean => {
    const validOperators = /^[x0-9+\-*/^()\s]+$/;
    return validOperators.test(equation);
};

const calculateResult = (x: number, equation: string): number => {
    const sanitizedEquation = equation.replace(/\^/g, '**');
    return eval(sanitizedEquation.replace(/x/g, x.toString()));
};

export default function FunctionChainCalculator() {
    const [functions, setFunctions] = useState<Function[]>(initialFunctions);
    const [initialInput, setInitialInput] = useState<number>(2);
    const [paths, setPaths] = useState<{input: {x: number, y: number}, output: {x: number, y: number}}[]>([]);

    const cardsRef = useRef<Array<HTMLDivElement | null>>([]);
    const inputRefs = useRef<Array<HTMLDivElement | null>>([]);
    const outputRefs = useRef<Array<HTMLDivElement | null>>([]);

    useEffect(() => {
        calculateChain();
    }, [initialInput, JSON.stringify(functions)]);

    const calculateChain = useCallback(() => {
        let result = initialInput;
        const executionOrder = [1, 2, 4, 5, 3];

        const updatedFunctions = functions.map(func => ({ ...func }));

        for (const id of executionOrder) {
            const funcIndex = updatedFunctions.findIndex(f => f.id === id);
            if (funcIndex !== -1) {
                updatedFunctions[funcIndex].input = result;
                result = calculateResult(result, updatedFunctions[funcIndex].equation);
                updatedFunctions[funcIndex].output = result;
            }
        }

        setFunctions(prevFunctions => {
            if (JSON.stringify(prevFunctions) !== JSON.stringify(updatedFunctions)) {
                return updatedFunctions;
            }
            return prevFunctions;
        });
    }, [initialInput, functions]);

    const handleEquationChange = (id: number, newEquation: string) => {
        if (validateEquation(newEquation)) {
            setFunctions(prevFunctions =>
                prevFunctions.map(func =>
                    func.id === id ? { ...func, equation: newEquation } : func
                )
            );
        } else {
            alert('Invalid equation. Please use valid operators and "x".');
        }
    };

    // Function to calculate paths
    const calculatePaths = useCallback(() => {
        const newPaths = functions.map((func) => {
            const inputPosition = inputRefs.current[func.id]?.getBoundingClientRect();
            const outputPosition = outputRefs.current[func.id]?.getBoundingClientRect();

            const inputCoordinates = inputPosition
                ? {
                    x: inputPosition.left + inputPosition.width / 2,
                    y: inputPosition.top + inputPosition.height,
                }
                : null;

            const outputCoordinates = outputPosition
                ? {
                    x: outputPosition.left + outputPosition.width / 2,
                    y: outputPosition.top,
                }
                : null;

            return inputCoordinates && outputCoordinates
                ? { input: inputCoordinates, output: outputCoordinates }
                : null;
        }).filter(path => path !== null);

        setPaths(newPaths as {input: {x: number, y: number}, output: {x: number, y: number}}[]);
    }, [functions]);

    useEffect(() => {
        calculatePaths();
    }, [functions, initialInput]);

    return (
        <div className="bg-[#F8F8F8] min-h-screen flex items-center justify-center before:opacity-40 p-4 bg-[url('/images/bg.png')]">
            <div className="max-w-6xl w-full">
                <div className="flex flex-col gap-16 relative">
                    <div className="flex gap-16 justify-between items-start relative">
                        <div className="relative self-end -right-12">
                            <InputOutput
                                labelText='Initial value of x'
                                labelBgColor='#E29A2D'
                                inputValue={initialInput}
                                inputOnChange={(e:any) => setInitialInput(Number(e.target.value))}
                                dividerColor='#FFEED5'
                                inputBorderColor='#E29A2D'
                            />
                        </div>
                        {functions.slice(0, 3).map((func) => (
                            <div
                                ref={(el: any) => cardsRef.current[func.id] = el}
                                key={func.id}
                            >
                                <FunctionCard
                                    func={func}
                                    onEquationChange={handleEquationChange}
                                    inputRef={(el: any) => inputRefs.current[func.id] = el}
                                    outputRef={(el: any) => outputRefs.current[func.id] = el}
                                />
                            </div>
                        ))}
                        <div className="relative self-end -left-12">
                            <InputOutput
                                labelText='Final Output y'
                                labelBgColor='#4CAF79'
                                inputValue={functions[2].output}
                                inputOnChange={() => {}}
                                dividerColor='#C5F2DA'
                                inputOrder='reversed'
                                inputBorderColor='#4CAF79'
                            />
                        </div>
                    </div>
                    <div className="flex gap-16 justify-center items-start relative">
                        {functions.slice(3, 5).map((func) => (
                            <div
                                ref={(el: any) => cardsRef.current[func.id] = el}
                                key={func.id}
                            >
                                <FunctionCard
                                    func={func}
                                    onEquationChange={handleEquationChange}
                                    inputRef={(el: any) => inputRefs.current[func.id] = el}
                                    outputRef={(el: any) => outputRefs.current[func.id] = el}
                                />
                            </div>
                        ))}
                    </div>
                    <svg className="absolute top-0 left-0 w-full h-full pointer-events-none">
                        {paths.map((path, index) => (
                            <path
                                key={index}
                                d={`M${path.input.x} ${path.input.y} L${path.output.x} ${path.output.y}`}
                                fill="none"
                                stroke="#AECDFA"
                                strokeWidth="7"
                                className="mix-blend-darken"
                            />
                        ))}
                    </svg>
                </div>
            </div>
        </div>
    );
}
