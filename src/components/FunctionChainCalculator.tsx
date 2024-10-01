import { useState, useEffect, useCallback } from 'react'
import FunctionCard from './FunctionCard'

type Function = {
    id: number
    equation: string
    nextFunction: number | null
    input: number
    output: number
}

const initialFunctions: Function[] = [
    { id: 1, equation: 'x^2', nextFunction: 2, input: 0, output: 0 },
    { id: 2, equation: '2*x+4', nextFunction: 4, input: 0, output: 0 },
    { id: 3, equation: 'x^2+20', nextFunction: null, input: 0, output: 0 },
    { id: 4, equation: 'x-2', nextFunction: 5, input: 0, output: 0 },
    { id: 5, equation: 'x/2', nextFunction: 3, input: 0, output: 0 },
]

const validateEquation = (equation: string): boolean => {
    const validOperators = /^[x0-9+\-*/^()\s]+$/
    return validOperators.test(equation)
}

const calculateResult = (x: number, equation: string): number => {
    console.log(x, equation)
    const sanitizedEquation = equation.replace(/\^/g, '**')
    return eval(sanitizedEquation.replace(/x/g, x.toString()))
}

export default function FunctionChainCalculator() {
    const [functions, setFunctions] = useState<Function[]>(initialFunctions)
    const [initialInput, setInitialInput] = useState<number>(2)

    useEffect(() => {
        calculateChain()
    }, [initialInput, JSON.stringify(functions)])

    // Memoized calculateChain function to avoid re-creation on each render
    const calculateChain = useCallback(() => {
        let result = initialInput
        const executionOrder = [1, 2, 4, 5, 3]

        const updatedFunctions = functions.map(func => ({ ...func }))

        for (const id of executionOrder) {
            const funcIndex = updatedFunctions.findIndex(f => f.id === id)
            if (funcIndex !== -1) {
                updatedFunctions[funcIndex].input = result
                result = calculateResult(result, updatedFunctions[funcIndex].equation)
                updatedFunctions[funcIndex].output = result
            }
        }

        // Only update state if there's an actual change
        setFunctions(prevFunctions => {
            if (JSON.stringify(prevFunctions) !== JSON.stringify(updatedFunctions)) {
                return updatedFunctions
            }
            return prevFunctions
        })
    }, [initialInput, functions])

    const handleEquationChange = (id: number, newEquation: string) => {
        if (validateEquation(newEquation)) {
            setFunctions(prevFunctions =>
                prevFunctions.map(func =>
                func.id === id ? { ...func, equation: newEquation } : func
                )
            )
        }
    }

    return (
        <div className="bg-[#F8F8F8] min-h-screen flex items-center justify-center p-4">
            <div className="bg-white rounded-[20px] p-8 shadow-lg max-w-6xl w-full">
                <div className="flex flex-col space-y-16 relative">
                    <div className="flex justify-between items-start relative">
                        <div className="w-[120px] text-center">
                        <div className="text-sm font-medium text-[#F4A261] mb-2">Initial value of x</div>
                        <input
                            type="number"
                            value={initialInput}
                            onChange={(e) => setInitialInput(Number(e.target.value))}
                            className="w-full p-2 border border-[#E5E7EB] rounded-md text-center text-lg font-semibold"
                        />
                        </div>
                        {functions.slice(0, 3).map((func, _) => (
                            <FunctionCard
                                key={func.id}
                                func={func}
                                onEquationChange={handleEquationChange}
                            />
                        ))}
                        <div className="w-[120px] text-center">
                            <div className="text-sm font-medium text-[#2A9D8F] mb-2">Final Output y</div>
                            <div className="w-full p-2 border border-[#E5E7EB] rounded-md text-center text-lg font-semibold">
                                {functions[2].output}
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-center items-start relative space-x-16">
                        {functions.slice(3, 5).map((func, _) => (
                            <FunctionCard
                                key={func.id}
                                func={func}
                                onEquationChange={handleEquationChange}
                            />
                        ))}
                    </div>
                    <svg className="absolute top-0 left-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
                        <path
                            d="M120 50 L220 50"
                            fill="none"
                            stroke="#93C5FD"
                            strokeWidth="2"
                        />
                        <path
                            d="M360 50 Q400 50 400 100 T440 150 Q480 150 480 200 T520 250"
                            fill="none"
                            stroke="#93C5FD"
                            strokeWidth="2"
                        />
                        <path
                            d="M680 250 Q720 250 720 200 T760 150 Q800 150 800 100 T840 50"
                            fill="none"
                            stroke="#93C5FD"
                            strokeWidth="2"
                        />
                        <path
                            d="M980 50 L1080 50"
                            fill="none"
                            stroke="#93C5FD"
                            strokeWidth="2"
                        />
                    </svg>
                </div>
            </div>
        </div>
    )
}

