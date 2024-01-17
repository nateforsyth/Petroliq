// https://usehooks-ts.com/
// https://usehooks-ts.com/react-hook/use-isomorphic-layout-effect
// useReadLocalStorage hook is incompatible with string only (non-JSON) localStorage values, modified under MIT license

import { useEffect, useLayoutEffect } from 'react'

export const UseIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;
