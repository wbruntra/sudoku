import type { ComponentChildren } from 'preact'
import { useLocation } from 'preact-iso'

interface NavLinkProps {
  href: string
  /** Match only the exact path instead of the path and its descendants. */
  end?: boolean
  class: string | ((state: { isActive: boolean }) => string)
  children?: ComponentChildren
}

/** An anchor that knows whether it points at the current route. */
export default function NavLink({ href, end, class: className, children }: NavLinkProps) {
  const { path } = useLocation()
  const isActive = end ? path === href : path === href || path.startsWith(`${href}/`)

  return (
    <a
      href={href}
      class={typeof className === 'function' ? className({ isActive }) : className}
      aria-current={isActive ? 'page' : undefined}
    >
      {children}
    </a>
  )
}
