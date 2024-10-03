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
    path?: string
}

const initialFunctions: Function[] = [
    { id: 1, equation: 'x^2', nextFunction: 2, input: 0, output: 0, path: 'quadratic'},
    { id: 2, equation: '2*x+4', nextFunction: 4, input: 0, output: 0, path: 'cubic'},
    { id: 3, equation: 'x^2+20', nextFunction: null, input: 0, output: 0,},
    { id: 4, equation: 'x-2', nextFunction: 5, input: 0, output: 0, path: 'quadratic' },
    { id: 5, equation: 'x/2', nextFunction: 3, input: 0, output: 0, path: 'bottomTopQuadratic'  },
]

const validateEquation = (equation: string): boolean => {
    const validOperators = /^[x0-9+\-*/^()\s]+$/
    return validOperators.test(equation)
}

const calculateResult = (x: number, equation: string): number => {
    const sanitizedEquation = equation.replace(/\^/g, '**')
    console.log(sanitizedEquation)
    return eval(sanitizedEquation.replace(/x/g, x.toString()))
}


export default function FunctionChainCalculator() {

    const [functions, setFunctions] = useState<Function[]>(initialFunctions)
    const [initialInput, setInitialInput] = useState<number>(2)

    const inputRefs = useRef<Array<HTMLDivElement | null>>([]);
    const outputRefs = useRef<Array<HTMLDivElement | null>>([]);
    const [paths, setPaths] = useState<string[]>([])


    useEffect(() => {
        calculateChain()
    }, [initialInput, JSON.stringify(functions)])

    useEffect(()=>{
        calculatePaths()
    }, [functions])

    const calculatePaths = useCallback(() => {
        const newPaths: string[] = [];
    
        const createPath = (startPos: DOMRect, endPos: DOMRect, pathType: string) => {
            const startX = startPos.right;
            const startY = startPos.top + startPos.height / 2;
            const endX = endPos.left;
            const endY = endPos.top + endPos.height / 2;

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

    
        functions.forEach((func) => {
            if (func.nextFunction !== null) {
                const outputElem = outputRefs.current[func.id];
                const nextInputElem = inputRefs.current[func.nextFunction];
    
                if (outputElem && nextInputElem) {
                    const outputPos = outputElem.getBoundingClientRect();
                    const inputPos = nextInputElem.getBoundingClientRect();
                    const pathType = func.path
                    const path = createPath(outputPos, inputPos, pathType);
                    newPaths.push(path);
                }
            }
        });
    
        setPaths(newPaths);
    }, [functions]);
    

    // Memoized calculateChain function to avoid re-creation on each render
    const calculateChain = useCallback(() => {
        let result = initialInput
        const executionOrder = [1, 2, 4, 5, 3]

        const updatedFunctions = functions.map(func => ({ ...func }))
        // console.log('113, calculate chain')
        for (const id of executionOrder) {
            const funcIndex = updatedFunctions.findIndex(f => f.id === id)
            if (funcIndex !== -1) {
                // console.log(117, result)
                updatedFunctions[funcIndex].input = result
                result = calculateResult(result, updatedFunctions[funcIndex].equation)
                console.log(120, result)
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


    return (
        <div className="bg-[#F8F8F8] min-h-screen flex items-center justify-center before:opacity-40 p-4 bg-[url('/images/bg.png')]">
            <div className="max-w-6xl w-full">
                {/* SVG for Paths */}
                <svg className="absolute top-0 left-0 w-full h-full pointer-events-none z-[11] mix-blend-multiply">
                    {paths.map((path, index) => (
                        <path 
                            key={index} 
                            d={path} 
                            strokeWidth="7" 
                            fill="none"
                            stroke="#AECDFA"
                        />
                    ))}
                </svg>
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
                        {functions.slice(0, 3).map((func, index) => (
                            <FunctionCard
                                key={func.id}
                                func={func}
                                onEquationChange={handleEquationChange}
                                // inputRef={(el: any)=> inputRefs.current[func.id] = el}
                                // outputRef={(el: any)=> outputRefs.current[func.id] = el}
                                ref={{
                                    inputRef: (el) => (inputRefs.current[func.id] = el),
                                    outputRef: (el) => (outputRefs.current[func.id] = el),
                                  }}

                            />
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
                            />
                        </div>
                    </div>
                    <div className="flex gap-16 justify-center items-start relative">
                        {functions.slice(3, 5).map((func, _) => (
                            <FunctionCard
                                key={func.id}
                                func={func}
                                onEquationChange={handleEquationChange}
                                inputRef={(el: any)=> inputRefs.current[func.id] = el}
                                outputRef={(el: any)=> outputRefs.current[func.id] = el}
                                ref={{
                                    inputRef: (el) => (inputRefs.current[func.id] = el),
                                    outputRef: (el) => (outputRefs.current[func.id] = el),
                                }}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

