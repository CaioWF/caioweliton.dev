import { NextResponse, type NextRequest } from 'next/server'
import { locales } from '@/lib/i18n/locales'
import { getLocale } from '@/lib/i18n/get-locale'

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  const pathnameHasLocale = locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  )
  if (pathnameHasLocale) return

  const locale = getLocale(request.headers.get('accept-language'))
  request.nextUrl.pathname = `/${locale}${pathname}`
  return NextResponse.redirect(request.nextUrl)
}

export const config = {
  matcher: ['/((?!_next|api|.*\\..*).*)'],
}
