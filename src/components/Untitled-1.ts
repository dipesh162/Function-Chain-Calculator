// React
import { useState, useEffect, useCallback, useRef } from 'react'

// Components
import FunctionCard from './FunctionCard'
import InputOutput from './InputOutput.tsx'

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
    const sanitizedEquation = equation.replace(/\^/g, '**')
    return eval(sanitizedEquation.replace(/x/g, x.toString()))
}


interface InputOutputRef {
    getWidth: () => number; // Your custom method
}

export default function FunctionChainCalculator() {

    const [functions, setFunctions] = useState<Function[]>(initialFunctions)
    const [initialInput, setInitialInput] = useState<number>(2)

    const cardsRef = useRef<Array<HTMLDivElement | null>>([]);
    const inputRefs = useRef<Array<HTMLDivElement | null>>([]);
    const outputRefs = useRef<Array<HTMLDivElement | null>>([]);


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
        } else {
            alert('Invalid equation. Please use valid operators and "x".')
        }
    }

    // Function to get position of the element for drawing lines
    const getCardPosition = (id: number) => {
        const card = cardsRef.current[id]
        console.log(card,id)
        if (card) {
            const rect = card.getBoundingClientRect()
            return {
                x: rect.left + rect.width / 2,
                y: rect.top + rect.height / 2,
            }
        }
        return null
    }


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
                                // ref={inputRef}
                            />
                        </div>
                        {functions.slice(0, 3).map((func, _) => (
                            <div
                                ref={(el: any)=> cardsRef.current[func.id] = el}
                            >
                            <FunctionCard
                                key={func.id}
                                func={func}
                                onEquationChange={handleEquationChange}
                                inputRef={(el: any)=> inputRefs.current[func.id] = el}
                                outputRef={(el: any)=> outputRefs.current[func.id] = el}
                            />
                            </div>
                        ))}
                        <div className="relative self-end -left-12">
                            <InputOutput
                                labelText='Final Output y'
                                labelBgColor='#4CAF79'
                                inputValue={functions[2].output}
                                inputOnChange={()=> {}}
                                dividerColor='#C5F2DA'
                                inputOrder='reversed'
                                inputBorderColor='#4CAF79'
                                // ref={outputRef}
                            />
                        </div>
                    </div>
                    <div className="flex gap-16 justify-center items-start relative">
                        {functions.slice(3, 5).map((func, _) => (
                            <div
                                ref={(el: any)=> cardsRef.current[func.id] = el}
                            >
                                <FunctionCard
                                    key={func.id}
                                    func={func}
                                    onEquationChange={handleEquationChange}
                                    inputRef={(el: any)=> inputRefs.current[func.id] = el}
                                    outputRef={(el: any)=> outputRefs.current[func.id] = el}
                                />
                            </div>
                        ))}
                    </div>
                    {/* <svg className="absolute top-0 left-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}> */}
                    {/* <svg>
                        <path
                            d="M120 50 L220 50"
                            fill="none"
                            stroke="#AECDFA"
                            strokeWidth="7"
                        />
                    </svg> */}
                        {/* <path
                            d="M360 50 Q400 50 400 100 T440 150 Q480 150 480 200 T520 250"
                            fill="none"
                            stroke="#AECDFA"
                            strokeWidth="7"
                        />
                        <path
                            d="M680 250 Q720 250 720 200 T760 150 Q800 150 800 100 T840 50"
                            fill="none"
                            stroke="#AECDFA"
                            strokeWidth="7"
                        />
                        <path
                            d="M980 50 L1080 50"
                            fill="none"
                            stroke="#AECDFA"
                            strokeWidth="7"
                        /> */}
                    {/* </svg> */}

                    {/* SVG for drawing connecting lines */}
                    {/* <svg className="absolute top-0 left-0 w-full h-full pointer-events-none">
                        {functions.map((func) => {
                            const position = getCardPosition(func.id);
                            const nextPosition = func.nextFunction ? getCardPosition(func.nextFunction) : null;

                            return (
                                position &&
                                nextPosition && (
                                    <path
                                        key={func.id}
                                        d={`M${position.x} ${position.y} L${nextPosition.x} ${nextPosition.y}`}
                                        fill="none"
                                        stroke="#AECDFA"
                                        strokeWidth="7"
                                        className="mix-blend-darken"
                                    />
                                )
                            );
                        })}
                    </svg> */}


<svg className="absolute top-0 left-0 w-full h-full pointer-events-none">
    {functions.map((func) => {
        console.log(inputRefs)
        console.log(outputRefs)
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

        console.log(inputPosition, outputPosition, inputCoordinates, outputCoordinates, )
              
        return (
            inputCoordinates &&
            outputCoordinates && (
                <path
                    key={func.id}
                    d={`M${inputCoordinates.x} ${inputCoordinates.y} L${outputCoordinates.x} ${outputCoordinates.y}`}
                    fill="none"
                    stroke="#AECDFA"
                    strokeWidth="7"
                    className="mix-blend-darken"
                />
            )
        );
    })}
</svg>
                </div>
            </div>
        </div>
    )
}

