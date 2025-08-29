

const ResetPassword = () => {
    return (
        <div className="flex items-start justify-center w-screen h-screen bg-[#cccccc]">
            <form className="w-[max(40vw,400px)] bg-white rounded">
                <div className="flex items-center justify-center pt-4 pb-2">
                    RESET PASSWORD
                </div>
                <hr />
                <div className="flex flex-col gap-2 mt-4 mb-4">
                    <div className="flex flex-col gap-1 px-4">
                        <label htmlFor="newPass">Nhap mat khau moi: </label>
                        <input 
                            type="newPass"
                            className="w-full border border-gray-400 py-1 px-2 focus:outline-hidden"
                        />
                    </div>
                    <div className="flex flex-col gap-1 px-4">
                        <label htmlFor="newPass">Xac nhan mat khau: </label>
                        <input 
                            type="newPass"
                            className="w-full border border-gray-400 py-1 px-2 focus:outline-hidden"
                        />
                    </div>
                </div>
                <div className="w-full flex justify-center mb-3">
                    <button className="w-[150px] py-2 bg-amber-100 rounded font-medium text-[20px]">
                        Submit
                    </button>
                </div>
            </form>
        </div>
    )
}

export default ResetPassword