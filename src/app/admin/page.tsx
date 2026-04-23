import { db } from "@/db"
import { users, admins, USER_TYPES } from "@/db/schema"
import { createUser, createAdmin, deleteUser, deleteAdmin, updateUser, updateAdmin, toggleUserStatus } from "./actions"
import { desc } from "drizzle-orm"
import Link from "next/link"
import SearchFilter from "./SearchFilter"
import RatesPanel from "./RatesPanel"
import { CopyPin } from "@/components/ui/CopyPin"

import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Admin Dashboard | Vasu"
}

export default async function AdminPage(props: { searchParams: Promise<{ editUserId?: string, editAdminId?: string, provType?: string, q?: string, statusFilter?: string, editRateId?: string, rateQ?: string, rateTab?: string }> }) {
  const searchParams = await props.searchParams;
  const editUserId = searchParams?.editUserId;
  const editAdminId = searchParams?.editAdminId;
  const provType = searchParams?.provType || 'user';

  const allUsers = await db.select().from(users).orderBy(desc(users.id))
  const allAdmins = await db.select().from(admins).orderBy(desc(admins.id))
  const isAdminLimitReached = allAdmins.length >= 3;

  const searchQuery = (searchParams?.q || '').toLowerCase();
  const statusFilter = searchParams?.statusFilter || 'all';

  let filteredUsers = allUsers;
  if (searchQuery) {
    filteredUsers = filteredUsers.filter(u => u.firstName.toLowerCase().includes(searchQuery) || u.lastName.toLowerCase().includes(searchQuery));
  }
  if (statusFilter !== 'all') {
    filteredUsers = filteredUsers.filter(u => u.status === statusFilter);
  }

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">

      <div className="flex items-center justify-between pointer-events-none">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-zinc-50">Accounts Matrix</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage network provisions, identity PINs, and routing.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 p-8 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm relative overflow-hidden">
        <div className="flex justify-between items-center mb-6 border-b border-gray-100 dark:border-zinc-800 pb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-锌-50">Provision New Account</h2>
          <div className="flex bg-gray-100 dark:bg-zinc-800 p-1 rounded-lg">
            <Link href="?provType=user" className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${provType === 'user' ? 'bg-white dark:bg-zinc-700 shadow-sm text-gray-900 dark:text-gray-100' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}>Retail User</Link>
            <Link href="?provType=admin" className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${provType === 'admin' ? 'bg-white dark:bg-zinc-700 shadow-sm text-gray-900 dark:text-gray-100' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}>Administrator</Link>
          </div>
        </div>

        {provType === 'user' ? (
          <form action={createUser} className="grid grid-cols-1 md:grid-cols-5 gap-6 items-end animate-in fade-in slide-in-from-right-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">First Name</label>
              <input name="firstName" type="text" required className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-black dark:focus:ring-white bg-transparent border-gray-200 dark:border-zinc-700 outline-none transition-shadow" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Last Name</label>
              <input name="lastName" type="text" required className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-black dark:focus:ring-white bg-transparent border-gray-200 dark:border-zinc-700 outline-none transition-shadow" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Type</label>
              <select name="type" className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-black dark:focus:ring-white bg-transparent border-gray-200 dark:border-zinc-700 outline-none transition-shadow">
                {USER_TYPES.filter(r => r !== 'USER').map(type => (
                  <option key={type} value={type} className="dark:bg-zinc-900">{type}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Slug</label>
              <input name="pageSlug" type="text" placeholder="e.g. rate-tier-a" className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-black dark:focus:ring-white bg-transparent border-gray-200 dark:border-zinc-700 outline-none transition-shadow" />
            </div>
            <button type="submit" className="px-6 py-2.5 bg-black dark:bg-white text-white dark:text-black font-semibold rounded-lg hover:opacity-90 transition-opacity whitespace-nowrap shadow-sm">
              Create User
            </button>
          </form>
        ) : (
          <div className="animate-in fade-in slide-in-from-left-4">
            {isAdminLimitReached ? (
              <div className="p-4 bg-orange-50 dark:bg-orange-500/10 border border-orange-100 dark:border-orange-500/20 rounded-lg flex items-center gap-3">
                <span className="text-orange-600 dark:text-orange-400 font-medium">Administrator limit reached (3/3).</span>
                <span className="text-orange-500/80 dark:text-orange-400/80 text-sm">Delete an existing admin to provision a new one.</span>
              </div>
            ) : (
              <form action={createAdmin} className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Username</label>
                  <input name="username" type="text" required className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-black dark:focus:ring-white bg-transparent border-gray-200 dark:border-zinc-700 outline-none transition-shadow" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
                  <input name="password" type="password" required className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-black dark:focus:ring-white bg-transparent border-gray-200 dark:border-zinc-700 outline-none transition-shadow" />
                </div>
                <button type="submit" className="px-6 py-2.5 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors whitespace-nowrap shadow-sm">
                  Create Admin
                </button>
              </form>
            )}
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between pl-1">
          <h3 className="text-xl font-bold text-gray-900 dark:text-zinc-50">Retail Users Directory</h3>
          <SearchFilter />
        </div>
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-gray-50/50 dark:bg-zinc-800/50 border-b border-gray-100 dark:border-zinc-800">
                <tr>
                  <th className="px-6 py-4 font-semibold text-gray-600 dark:text-gray-300 w-16">PIN</th>
                  <th className="px-6 py-4 font-semibold text-gray-600 dark:text-gray-300">Identity</th>
                  <th className="px-6 py-4 font-semibold text-gray-600 dark:text-gray-300">Status</th>
                  <th className="px-6 py-4 font-semibold text-gray-600 dark:text-gray-300">Type</th>
                  <th className="px-6 py-4 font-semibold text-gray-600 dark:text-gray-300">Slug</th>
                  <th className="px-6 py-4 font-semibold text-right text-gray-600 dark:text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
                {filteredUsers.length === 0 ? (
                  <tr><td colSpan={6} className="px-6 py-8 text-center text-gray-400">No users found.</td></tr>
                ) : null}
                {filteredUsers.map((user) => {
                  const isEditing = editUserId === user.id.toString();
                  const formId = `edit-user-${user.id}`;

                  if (isEditing) {
                    return (
                      <tr key={`edit-${user.id}`} className="bg-blue-50/50 dark:bg-blue-900/10 transition-colors">
                        <td className="px-6 py-4"><CopyPin pin={user.pin} /></td>
                        <td className="px-6 py-4 flex gap-2">
                          <input form={formId} name="firstName" type="text" defaultValue={user.firstName} required className="w-1/2 px-2 py-1.5 bg-white dark:bg-zinc-950 border border-gray-300 dark:border-zinc-700 rounded focus:ring-2 focus:ring-blue-500 outline-none" placeholder="First" />
                          <input form={formId} name="lastName" type="text" defaultValue={user.lastName} required className="w-1/2 px-2 py-1.5 bg-white dark:bg-zinc-950 border border-gray-300 dark:border-zinc-700 rounded focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Last" />
                        </td>
                        <td className="px-6 py-4">
                          <select form={formId} name="status" defaultValue={user.status} className="w-full px-2 py-1.5 bg-white dark:bg-zinc-950 border border-gray-300 dark:border-zinc-700 rounded focus:ring-2 focus:ring-blue-500 outline-none">
                            <option value="active">Active</option>
                            <option value="disabled">Disabled</option>
                          </select>
                        </td>
                        <td className="px-6 py-4">
                          <select form={formId} name="type" defaultValue={user.type} className="w-full px-2 py-1.5 bg-white dark:bg-zinc-950 border border-gray-300 dark:border-zinc-700 rounded focus:ring-2 focus:ring-blue-500 outline-none">
                            {USER_TYPES.filter(r => r !== 'USER').map(r => <option key={r} value={r}>{r}</option>)}
                          </select>
                        </td>
                        <td className="px-6 py-4">
                          <input form={formId} name="pageSlug" type="text" defaultValue={user.pageSlug || ''} placeholder="—" className="w-full px-2 py-1.5 bg-white dark:bg-zinc-950 border border-gray-300 dark:border-zinc-700 rounded focus:ring-2 focus:ring-blue-500 outline-none" />
                        </td>
                        <td className="px-6 py-4 text-right space-x-2">
                          <form id={formId} action={updateUser} className="hidden">
                            <input type="hidden" name="id" value={user.id} />
                          </form>
                          <button form={formId} type="submit" className="text-sm px-3 py-1.5 bg-black text-white dark:bg-white dark:text-black rounded hover:opacity-80 transition-opacity font-medium">Save</button>
                          <Link href="/admin" className="text-sm px-3 py-1.5 bg-gray-200 dark:bg-zinc-800 text-gray-800 dark:text-gray-200 rounded hover:opacity-80 transition-opacity font-medium">Cancel</Link>
                        </td>
                      </tr>
                    )
                  }

                  return (
                    <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors">
                      <td className="px-6 py-4"><CopyPin pin={user.pin} /></td>
                      <td className="px-6 py-4 font-medium text-gray-900 dark:text-gray-100">{user.firstName} {user.lastName}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${user.status === 'active' ? 'bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400'}`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 dark:bg-zinc-800 dark:text-zinc-300 ring-1 ring-gray-500/10 dark:ring-zinc-700">
                          {user.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-600 dark:text-gray-400 font-mono text-sm">{user.pageSlug || <span className="text-gray-300 dark:text-zinc-600">—</span>}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end items-center gap-1.5">
                          <form action={toggleUserStatus}>
                            <input type="hidden" name="id" value={user.id} />
                            <button title={user.status === 'active' ? 'Disable' : 'Enable'} type="submit" className={`p-1.5 rounded transition-colors ${user.status === 'active' ? 'text-orange-600 hover:text-orange-800 bg-orange-50 dark:bg-orange-500/10 dark:text-orange-400 dark:hover:text-orange-300' : 'text-green-600 hover:text-green-800 bg-green-50 dark:bg-green-500/10 dark:text-green-400 dark:hover:text-green-300'}`}>
                              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18.36 6.64a9 9 0 1 1-12.73 0" /><line x1="12" y1="2" x2="12" y2="12" /></svg>
                            </button>
                          </form>
                          <Link href={`/admin/users/${user.id}`} title="Profile" className="p-1.5 bg-indigo-50 dark:bg-indigo-500/10 rounded text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                          </Link>
                          <Link href={`/admin?editUserId=${user.id}`} title="Edit" className="p-1.5 bg-blue-50 dark:bg-blue-500/10 rounded text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" /><path d="m15 5 4 4" /></svg>
                          </Link>
                          <form action={deleteUser}>
                            <input type="hidden" name="id" value={user.id} />
                            <button type="submit" title="Delete" className="p-1.5 bg-red-50 dark:bg-red-500/10 rounded text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition-colors">
                              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></svg>
                            </button>
                          </form>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-bold text-gray-900 dark:text-zinc-50 pl-1">Administrators</h3>
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm overflow-hidden">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-50/50 dark:bg-zinc-800/50 border-b border-gray-100 dark:border-zinc-800">
              <tr>
                <th className="px-6 py-4 font-semibold text-gray-600 dark:text-gray-300">ID</th>
                <th className="px-6 py-4 font-semibold text-gray-600 dark:text-gray-300">Username</th>
                <th className="px-6 py-4 font-semibold text-gray-600 dark:text-gray-300">Identifier</th>
                <th className="px-6 py-4 font-semibold text-gray-600 dark:text-gray-300">Password</th>
                <th className="px-6 py-4 font-semibold text-right text-gray-600 dark:text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
              {allAdmins.map((admin) => {
                const isEditing = editAdminId === admin.id.toString();
                const formId = `edit-admin-${admin.id}`;

                if (isEditing) {
                  return (
                    <tr key={`edit-a-${admin.id}`} className="bg-blue-50/50 dark:bg-blue-900/10 transition-colors">
                      <td className="px-6 py-4 text-gray-400 font-mono text-xs">{admin.id}</td>
                      <td className="px-6 py-4">
                        <input form={formId} name="username" type="text" defaultValue={admin.username} required className="w-full px-2 py-1.5 bg-white dark:bg-zinc-950 border border-gray-300 dark:border-zinc-700 rounded focus:ring-2 focus:ring-blue-500 outline-none" />
                      </td>
                      <td className="px-6 py-4"><span className="inline-flex items-center px-2 py-0.5 rounded bg-indigo-100 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400 text-xs font-medium">ADMIN</span></td>
                      <td className="px-6 py-4">
                        <input form={formId} name="password" type="password" placeholder="Leave blank to keep" className="w-full px-2 py-1.5 bg-white dark:bg-zinc-950 border border-gray-300 dark:border-zinc-700 rounded focus:ring-2 focus:ring-blue-500 outline-none" />
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <form id={formId} action={updateAdmin} className="hidden">
                          <input type="hidden" name="id" value={admin.id} />
                        </form>
                        <button form={formId} type="submit" className="text-sm px-3 py-1.5 bg-indigo-600 text-white rounded hover:opacity-80 transition-opacity font-medium">Save</button>
                        <Link href="/admin" className="text-sm px-3 py-1.5 bg-gray-200 dark:bg-zinc-800 text-gray-800 dark:text-gray-200 rounded hover:opacity-80 transition-opacity font-medium">Cancel</Link>
                      </td>
                    </tr>
                  )
                }

                return (
                  <tr key={admin.id} className="hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors">
                    <td className="px-6 py-4 text-gray-400 font-mono text-xs">{admin.id}</td>
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-gray-100">{admin.username}</td>
                    <td className="px-6 py-4"><span className="inline-flex items-center px-2 py-0.5 rounded bg-indigo-100 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400 text-xs font-medium">ADMIN</span></td>
                    <td className="px-6 py-4 text-gray-400 italic text-xs">Hidden</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end items-center gap-1.5">
                        <Link href={`/admin?editAdminId=${admin.id}`} title="Edit" className="p-1.5 bg-blue-50 dark:bg-blue-500/10 rounded text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors">
                          <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" /><path d="m15 5 4 4" /></svg>
                        </Link>
                        <form action={deleteAdmin}>
                          <input type="hidden" name="id" value={admin.id} />
                          <button type="submit" title="Delete" className="p-1.5 bg-red-50 dark:bg-red-500/10 rounded text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></svg>
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      <RatesPanel editRateId={searchParams?.editRateId} rateQ={searchParams?.rateQ} rateTab={searchParams?.rateTab} />
    </div>
  )
}
