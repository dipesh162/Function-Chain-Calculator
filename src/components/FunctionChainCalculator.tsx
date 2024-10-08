// React
import { useState, useEffect, useCallback, useRef } from 'react'

// Components
import FunctionCard from './FunctionCard'
import InputOutput from './InputOutput.tsx'
import Path from './Path.tsx/index.tsx'

// Static
import functionsData from '../static/functionsData.ts'

// Types
import { FunctionType } from '../types/functionTypes.ts'

// Helpers
import calculateResult from '../helpers/calculateResult.ts'
import validateEquation from '../helpers/validateEquation.ts'



export default function FunctionChainCalculator() {

    const [functions, setFunctions] = useState<FunctionType[]>(functionsData)
    const [initialInput, setInitialInput] = useState<number>(2)
    const [paths, setPaths] = useState<string[]>([])

    const inputRefs = useRef<Array<HTMLDivElement | null>>([]);
    const outputRefs = useRef<Array<HTMLDivElement | null>>([]);
    


    useEffect(() => {
        calculateChain()
    }, [initialInput, JSON.stringify(functions)])

    useEffect(()=>{
        // Calculate paths initially
        calculatePaths();

        const handleResize = () => {
            // Recalculate paths on resize
            calculatePaths();
        };

        // Add event listener for resize
        window.addEventListener('resize', handleResize);

        // Cleanup function to remove the event listener
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [functions])

    const calculatePaths = useCallback(() => {
        const newPaths: string[] = [];
    
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

    
        functions.forEach((func) => {
            if (func.path && func.nextFunction) {
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


    return (
        <div className="bg-[#F8F8F8] min-h-screen flex items-center justify-center before:opacity-40 p-4 bg-[url('/images/bg.png')]">
            <div className="max-w-6xl w-full">
                {/* SVG for Paths */}
                <svg className="absolute top-0 left-0 w-full h-full pointer-events-none z-[11] mix-blend-multiply">
                    {paths.map((path, index) => (
                        <Path
                            key={index}
                            path={path} 
                            strokeWidth='8' 
                            fill='none'
                            stroke='#AECDFA'
                        />
                    ))}
                </svg>
                <div className="flex flex-col gap-16 relative">
                    <div className="flex gap-16 justify-between items-start relative">
                        <div className="relative self-end -mb-[1px] -right-12">
                            <InputOutput
                                labelText='Initial value of x'
                                labelBgColor='#E29A2D'
                                inputValue={initialInput}
                                inputOnChange={(e:any) => setInitialInput(Number(e.target.value))}
                                dividerColor='#FFEED5'
                                inputBorderColor='#E29A2D'
                            />
                        </div>
                        {functions.slice(0, 3).map((func, _) => (
                            <FunctionCard
                                key={func.id}
                                func={func}
                                onEquationChange={handleEquationChange}
                                refObj={{
                                    inputRef: (el:HTMLDivElement | null) => (inputRefs.current[func.id] = el),
                                    outputRef: (el: HTMLDivElement | null) => (outputRefs.current[func.id] = el),
                                  }}
                            />
                        ))}
                        <div className="relative self-end -mb-[1px] -left-12">
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
                                refObj={{
                                    inputRef: (el: HTMLDivElement) => (inputRefs.current[func.id] = el),
                                    outputRef: (el: HTMLDivElement) => (outputRefs.current[func.id] = el),
                                }}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

