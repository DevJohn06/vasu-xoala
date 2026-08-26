"use client";

import React, { useState } from "react";
import Link from "next/link";
import { CopyPin } from "@/components/ui/CopyPin";
import { Pagination } from "@/components/ui/Pagination";
import { deleteUser, toggleUserStatus, updateUser } from "./actions";
import { USER_TYPES } from "@/db/schema";

export type AdminUserRow = {
  id: number;
  firstName: string;
  lastName: string;
  pin: string;
  type: string;
  pageSlug: string | null;
  status: string;
  createdAt: Date;
};

export default function UsersDirectoryTable({
  users,
  editUserId,
}: {
  users: AdminUserRow[];
  editUserId?: string;
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 35;

  const paginatedUsers = users.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap font-semibold">
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
            {users.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-400">
                  No users found.
                </td>
              </tr>
            ) : null}
            {paginatedUsers.map((user) => {
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
                      <button form={formId} type="submit" className="text-sm px-3 py-1.5 bg-black text-white dark:bg-white dark:text-black rounded hover:opacity-80 transition-opacity font-medium cursor-pointer">Save</button>
                      <Link href="/admin" className="text-sm px-3 py-1.5 bg-gray-200 dark:bg-zinc-800 text-gray-800 dark:text-gray-200 rounded hover:opacity-80 transition-opacity font-medium">Cancel</Link>
                    </td>
                  </tr>
                );
              }

              return (
                <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors">
                  <td className="px-6 py-4"><CopyPin pin={user.pin} /></td>
                  <td className="px-6 py-4 font-bold text-gray-900 dark:text-gray-100">{user.firstName} {user.lastName}</td>
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
                        <button title={user.status === 'active' ? 'Disable' : 'Enable'} type="submit" className={`p-1.5 rounded transition-colors cursor-pointer ${user.status === 'active' ? 'text-orange-600 hover:text-orange-800 bg-orange-50 dark:bg-orange-500/10 dark:text-orange-400 dark:hover:text-orange-300' : 'text-green-600 hover:text-green-800 bg-green-50 dark:bg-green-500/10 dark:text-green-400 dark:hover:text-green-300'}`}>
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
                        <button type="submit" title="Delete" className="p-1.5 bg-red-50 dark:bg-red-500/10 rounded text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition-colors cursor-pointer">
                          <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></svg>
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-4 border-t border-gray-100 dark:border-zinc-800">
        <Pagination
          currentPage={currentPage}
          totalItems={users.length}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}
