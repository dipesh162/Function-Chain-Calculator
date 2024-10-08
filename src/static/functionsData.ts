// Types
import { FunctionType } from "../types/functionTypes"

const functionsData : FunctionType[] = [
    { id: 1, equation: 'x^2', nextFunction: 2, input: 0, output: 0, path: 'quadratic'},
    { id: 2, equation: '2*x+4', nextFunction: 4, input: 0, output: 0, path: 'cubic'},
    { id: 3, equation: 'x^2+20', nextFunction: null, input: 0, output: 0, path: null},
    { id: 4, equation: 'x-2', nextFunction: 5, input: 0, output: 0, path: 'quadratic' },
    { id: 5, equation: 'x/2', nextFunction: 3, input: 0, output: 0, path: 'bottomTopQuadratic'  },
]

export default functionsData