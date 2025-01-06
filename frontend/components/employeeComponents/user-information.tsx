interface UserInfoProps {
    email: string;
    level: string | null;
  }

const UserInfo = ({ email, level }: UserInfoProps) => {
    return (
        <div>
            <div className="p-4 text-white">
                <h3 className="text-lg font-semibold underline mb-2">Information</h3>
                <div>
                    <p className="mb-1">
                        <span className="font-medium">Email: </span>
                        <span className="text-gray-400">{email}</span>
                    </p>
                    <p className="mb-1">
                        <span className="font-medium">Department: </span>
                        <span className="text-gray-400"> Placeholder Department</span>
                        {/* db needs department */}
                    </p>
                    <p className="mb-1">
                        <span className="font-medium">Level: </span>
                        <span className="text-gray-400">{level}</span>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default UserInfo

