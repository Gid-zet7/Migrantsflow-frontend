import { useNavigate } from "react-router-dom";
import { useGetUsersQuery } from "./usersApiSlice";
import { memo } from "react";
import { Link } from "react-router-dom";

const User = ({ userId }) => {
  // Destructure the user from result
  const { user } = useGetUsersQuery("usersList", {
    selectFromResult: ({ data }) => ({
      user: data?.entities[userId],
    }),
  });

  const navigate = useNavigate();

  if (user) {
    const handleEdit = () => navigate(`/dashboard/users/edituser/${userId}`);

    const userRolesString = user.roles.toString().replaceAll(",", ", ");

    const cellStatus = user.active ? "" : "table__cell--inactive";

    return (
      <tr>
        <td className={`table__cell ${cellStatus}`}>
          <Link to={`/dash/users/${user.id}`}>{user.username} </Link>
        </td>
        <td className={`table__cell ${cellStatus}`}>{userRolesString}</td>
        <td className={`table__cell ${cellStatus}`}>
          <button className="btn" onClick={handleEdit}>
            Edit
          </button>
        </td>
      </tr>
    );
  } else return null;
};

const memoizedUser = memo(User);

export default memoizedUser;
