import { useGetUsersQuery } from '../users/usersSlice'

export default function UsersList() {
  const {
    data: users,
    isLoading,
    error,
  } = useGetUsersQuery(undefined, {
    refetchOnMountOrArgChange: true,
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center border border-void-line bg-void-raised p-12">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-void-line border-t-lime" />
        <span className="ml-4 text-sm text-ink-dim">Loading users...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="border border-void-line bg-void-raised p-6">
        <span className="inline-block border border-flame/40 bg-flame/10 px-2 py-0.5 font-mono text-[0.65rem] uppercase tracking-widest text-flame">
          Error
        </span>
        <p className="mt-3 text-sm text-ink">Failed to load users. Please try again.</p>
      </div>
    )
  }

  return (
    <div className="animate-rise border border-void-line bg-void-raised p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl text-ink">Team Members</h2>
          <p className="mt-1 text-sm text-ink-dim">Manage your team and view their details</p>
        </div>
        <span className="border border-sky/40 bg-sky/10 px-2 py-0.5 font-mono text-[0.65rem] uppercase tracking-widest text-sky">
          {users?.length || 0} Users
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-void-line">
              <th className="py-2 pr-4 font-mono text-xs font-medium uppercase tracking-widest text-ink-dim">
                User
              </th>
              <th className="py-2 pr-4 font-mono text-xs font-medium uppercase tracking-widest text-ink-dim">
                Email
              </th>
              <th className="py-2 pr-4 font-mono text-xs font-medium uppercase tracking-widest text-ink-dim">
                Role
              </th>
              <th className="py-2 font-mono text-xs font-medium uppercase tracking-widest text-ink-dim">
                Joined
              </th>
            </tr>
          </thead>
          <tbody>
            {users?.map((user) => (
              <tr key={user.id} className="border-b border-void-line/60 last:border-0">
                <td className="py-3 pr-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center border border-lime/40 bg-lime/10 font-mono text-sm font-semibold text-lime">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-medium text-ink">{user.name}</span>
                  </div>
                </td>
                <td className="py-3 pr-4 text-ink-dim">{user.email}</td>
                <td className="py-3 pr-4">
                  <span className="border border-sky/40 bg-sky/10 px-2 py-0.5 font-mono text-[0.65rem] uppercase tracking-widest text-sky">
                    {user.role || 'user'}
                  </span>
                </td>
                <td className="py-3 text-ink-dim">
                  {user.createdAt
                    ? new Date(user.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })
                    : '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
