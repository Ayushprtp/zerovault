import { RolePermission } from '@/src/lib/database.types';
import { deleteRolePermission } from '@/src/app/dashboard/roles/actions';

interface RoleTableProps {
  roles: RolePermission[];
}

export default function RoleTable({ roles }: RoleTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Role
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              RPM Limit
            </th>
            <th scope="col" className="relative px-6 py-3">
              <span className="sr-only">Edit</span>
            </th>
            <th scope="col" className="relative px-6 py-3">
              <span className="sr-only">Delete</span>
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {roles.map((role) => (
            <tr key={role.role}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {role.role}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {role.rpm_limit}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                {/* Link to edit role - adjust href as needed */}
                <a href={`/dashboard/roles/edit/${role.role}`} className="text-indigo-600 hover:text-indigo-900">
                  Edit
                </a>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                {/* Delete button */}
                <button
                  onClick={() => deleteRolePermission(role.role)}
                  className="text-red-600 hover:text-red-900"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}