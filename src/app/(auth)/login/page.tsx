import { login } from "./actions"

export default async function LoginPage(props: { searchParams: Promise<{ error?: string }> }) {
  const searchParams = await props.searchParams;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-zinc-950 p-4">
      <div className="w-full max-w-sm p-8 space-y-6 bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-gray-100 dark:border-zinc-800">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-zinc-50">Welcome back</h1>
          <p className="text-sm text-gray-500 dark:text-zinc-400">Enter your credentials to access your account</p>
        </div>
        
        <form action={login} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-zinc-300" htmlFor="username">Username</label>
            <input 
              id="username" 
              name="username" 
              type="text" 
              required 
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white bg-transparent border-gray-200 dark:border-zinc-800 text-gray-900 dark:text-zinc-50"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-zinc-300" htmlFor="password">Password</label>
            <input 
              id="password" 
              name="password" 
              type="password" 
              required 
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white bg-transparent border-gray-200 dark:border-zinc-800 text-gray-900 dark:text-zinc-50"
            />
          </div>
          {searchParams.error && <p className="text-red-500 text-sm">Valid credentials are required.</p>}
          <button type="submit" className="w-full py-2.5 px-4 bg-black dark:bg-white text-white dark:text-black font-medium rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors">
            Sign In
          </button>
        </form>
      </div>
    </div>
  )
}
