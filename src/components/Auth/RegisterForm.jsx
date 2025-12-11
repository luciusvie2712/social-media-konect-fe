import { useState } from "react"
import { toast } from "react-toastify"
import { createUserAPI } from "../../utils/api.customize"
import { useNavigate } from "react-router-dom"

const RegisterForm = ({ setFormType }) => {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate()

    const handleRegister = async (e) => {
        e.preventDefault()
        
        if (!name || !email || !password) {
            toast.error("Vui lòng nhập đầy đủ thông tin")
            return
        }
        
        if (password.length < 8) {
            toast.error("Mật khẩu phải có ít nhất 8 ký tự")
            return
        }
        
        setIsLoading(true)
        try {
            const res = await createUserAPI(name, email, password)
            if (res.Ec === 0) {
                toast.success('Đăng ký tài khoản thành công!')
                setFormType("login")
            } else {
                toast.warning(res?.Mes || "Đã xảy ra lỗi") 
            }
        } catch (error) {
            console.error("Registration error:", error)
            toast.error("Đã xảy ra lỗi, vui lòng thử lại!")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="w-full max-w-md">
            <div className="w-full flex flex-col bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-100">
                <div className="w-full flex flex-col items-center py-2 bg-gradient-to-r from-green-600 to-emerald-600">
                    <div className="flex items-center justify-center mb-2">
                        <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                            <i className="fa-solid fa-user-plus text-white text-xl"></i>
                        </div>
                    </div>
                    <span className="text-3xl font-bold text-white">Tạo tài khoản mới</span>
                    <span className="text-green-100 text-sm mt-2!">Tham gia cộng đồng của chúng tôi</span>
                </div>

                <form onSubmit={handleRegister} className="w-full flex flex-col gap-2 py-3 px-3">
                    <div className="w-full flex flex-col justify-center">
                        <label className="w-full block text-sm font-medium text-gray-700 mb-2">
                            <i className="fa-solid fa-user text-green-500 mr-2!"></i>
                            Tên hiển thị
                        </label>
                        <div className="relative">
                            <i className="fa-solid fa-user absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                            <input 
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full pl-10! pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                                type="text" 
                                name="name" 
                                placeholder="Nhập tên của bạn" 
                                required
                                disabled={isLoading}
                            />
                        </div>
                    </div>

                    <div className="w-full flex flex-col justify-center">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <i className="fa-solid fa-envelope text-green-500 mr-2!"></i>
                            Email
                        </label>
                        <div className="relative">
                            <i className="fa-solid fa-envelope absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                            <input 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-10! pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                                type="email" 
                                name="email" 
                                placeholder="Nhập email của bạn" 
                                required
                                disabled={isLoading}
                            />
                        </div>
                    </div>

                    <div className="w-full flex flex-col justify-center">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <i className="fa-solid fa-lock text-green-500 mr-2!"></i>
                            Mật khẩu
                        </label>
                        <div className="relative">
                            <i className="fa-solid fa-lock absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                            <input 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-10! pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                                type="password" 
                                name="password" 
                                placeholder="Nhập mật khẩu (ít nhất 8 ký tự)"
                                required
                                disabled={isLoading}
                            />
                            {password.length > 0 && (
                                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                                    <div className={`w-5 h-5 rounded-full flex items-center justify-center ${password.length >= 8 ? 'bg-green-500' : 'bg-yellow-500'}`}>
                                        <i className={`fas text-xs text-white ${password.length >= 8 ? 'fa-check' : 'fa-exclamation'}`}></i>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="mt-2 flex items-center justify-between">
                            <span className="text-xs text-gray-500">
                                {password.length > 0 && `${password.length}/8 ký tự`}
                            </span>
                            <span className={`text-xs ${password.length >= 8 ? 'text-green-600' : 'text-yellow-600'}`}>
                                {password.length > 0 && (password.length >= 8 ? 'Mật khẩu hợp lệ' : 'Cần 6 ký tự')}
                            </span>
                        </div>
                    </div>

                    <div className="w-full flex justify-center">
                        <label className="flex items-start">
                            <input
                                type="checkbox"
                                className="mt-1 h-3 w-4 text-green-600 rounded focus:ring-green-500"
                                required
                                disabled={isLoading}
                            />
                            <span className="ml-1! text-sm text-gray-600">
                                Tôi đồng ý với{' '}
                                <button type="button" className="text-green-600 hover:underline font-medium">
                                    Điều khoản dịch vụ
                                </button>{' '}
                                và{' '}
                                <button type="button" className="text-green-600 hover:underline font-medium">
                                    Chính sách bảo mật
                                </button>
                            </span>
                        </label>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-3 px-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-lg hover:from-green-700 hover:to-emerald-700 shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                        {isLoading ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2!"></div>
                                Đang xử lý...
                            </>
                        ) : (
                            <>
                                <i className="fa-solid fa-user-plus mr-2!"></i>
                                Đăng ký tài khoản
                            </>
                        )}
                    </button>

                    <div className="text-center w-ful flex justify-center">
                        <p className="text-gray-600">
                            Đã có tài khoản?{' '}
                            <button
                                type="button"
                                onClick={() => setFormType("login")}
                                className="text-green-600 hover:text-green-800 font-semibold transition-colors"
                                disabled={isLoading}
                            >
                                Đăng nhập ngay
                            </button>
                        </p>
                    </div>

                    <div className="w-full flex justify-center py-3 bg-blue-50 rounded-lg border border-blue-100">
                        <div className="flex items-center gap-3">
                            <i className="fa-solid fa-shield-alt text-blue-500"></i>
                            <div className="flex flex-col">
                                <span className="text-sm font-medium text-blue-800 mb-1">Thông tin của bạn được bảo mật</span>
                                <span className="text-xs text-blue-600">
                                    Chúng tôi mã hóa và bảo vệ thông tin cá nhân của bạn
                                </span>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default RegisterForm