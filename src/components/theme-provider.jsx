// "use client"

// import { createContext, useContext, useEffect, useState } from "react"

// const ThemeContext = createContext({ theme: "light", setTheme: () => null })

// export function ThemeProvider({ children, defaultTheme = "light", storageKey = "theme", ...props }) {
//   const [theme, setTheme] = useState(() => {
//     const storedTheme = localStorage.getItem(storageKey)
//     return storedTheme || defaultTheme
//   })

//   useEffect(() => {
//     const root = window.document.documentElement

//     root.classList.remove("light", "dark")

//     if (theme === "system") {
//       const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
//       root.classList.add(systemTheme)
//       return
//     }

//     root.classList.add(theme)
//   }, [theme])

//   const value = {
//     theme,
//     setTheme: (newTheme) => {
//       localStorage.setItem(storageKey, newTheme)
//       setTheme(newTheme)
//     },
//   }

//   return (
//     <ThemeContext.Provider {...props} value={value}>
//       {children}
//     </ThemeContext.Provider>
//   )
// }

// export const useTheme = () => {
//   const context = useContext(ThemeContext)

//   if (context === undefined) throw new Error("useTheme must be used within a ThemeProvider")

//   return context
// }
