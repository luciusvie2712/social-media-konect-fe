import { useState } from "react"
import { toast } from "react-toastify"
import { createUserAPI } from "../../utils/api.customize"
import { useNavigate } from "react-router-dom"

const RegisterForm = () => {
    const [ name, setName ] = useState('')
    const [ email, setEmail ] = useState('')
    const [ password, setPassword ] = useState('')
    const navigate = useNavigate()

    const handleRegister = async (e) => {
        e.preventDefault()
        try {
            const res = await createUserAPI(name, email, password)
            console.log(res.data)
            if (res.data.Ec === 0) {
                console.log('done here')
                toast.success('Register account success')
                navigate('/auth', { state: { formType: 'login' } })
            } else {
                toast.error(res.data.Mes) 
            }
        } catch (error) {
            toast.error("Something went wrong!")
        } 
    }

    return (
        <form onSubmit={handleRegister} className="w-[max(40vw,400px)] bg-white rounded">
            <div className="flex items-center justify-center pt-4 pb-2">
                <div className="h-full font-semibold text-2xl">REGISTER ACCOUNT</div>
            </div>
            <hr />
            <div className="flex flex-col gap-4 mt-5 px-4 mb-4">
                <div className="flex items-center gap-3">
                    <i className="fa-solid fa-user w-3"></i>
                    <input 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full rounded border border-gray-400 py-2 px-2"
                        type="text" name="name" placeholder="Enter your username ... " 
                        required
                    />
                </div>
                <div className="flex items-center gap-3">
                    <i className="fa-solid fa-envelope w-2"></i>
                    <input 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full border border-gray-400 py-2 px-2" 
                        type="email" name="email" placeholder="Enter your email ... " required
                    />
                </div>
                <div className="flex items-center gap-3">
                    <i className="fa-solid fa-lock w-2"></i>
                    <input 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full rounded border border-gray-400 py-2 px-2"
                        type="password" name="password" placeholder="Enter your password ... "
                    />
                </div>
                <div className="flex justify-between text-[14px]">
                    <p>You have account </p>
                    <p>Forgot password?</p>
                </div>
            </div>
            <div className="w-full flex justify-center mb-5">
                <button  className="w-[200px] py-2 bg-amber-100 rounded font-medium text-[20px]">Register</button>
            </div>
        </form>
    )
}

export default RegisterForm

