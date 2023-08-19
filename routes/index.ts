function path(root: string, sublink: string) {
    return `${root}${sublink}`
}

const ROOTS_DASHBOARD = '/dashboard'
const ROOTS_PAGES = '/pages'
const ROOTS_PROJECTS = '/projects'
const ROOTS_ORDERS = '/orders'
const ROOTS_INVOICES = '/invoices'
const ROOTS_TASKS = '/tasks'
const ROOTS_CALENDAR = '/calendar'
const ROOTS_AUTH = '/auth'
const ROOTS_ERRORS = ''
const ROOTS_START = '/start'
const ROOTS_DOCS = '/docs'
const ROOTS_CHANGELOG = '/changelog'

export const PATH_DASHBOARD = {
    root: ROOTS_DASHBOARD,
    default: path(ROOTS_DASHBOARD, '/default'),
    analytics: path(ROOTS_DASHBOARD, '/analytics'),
    saas: path(ROOTS_DASHBOARD, '/saas'),
}

export const PATH_PAGES = {
    root: ROOTS_PAGES,
    profile: path(ROOTS_PAGES, '/profile'),
    settings: path(ROOTS_PAGES, '/settings'),
    pricing: path(ROOTS_PAGES, '/pricing'),
    chat: path(ROOTS_PAGES, '/chat'),
    blank: path(ROOTS_PAGES, '/blank'),
}

export const PATH_PROJECTS = {
    root: ROOTS_PROJECTS,
}

export const PATH_ORDERS = {
    root: ROOTS_ORDERS,
}

export const PATH_INVOICES = {
    root: ROOTS_INVOICES,
    invoices: {
        all: path(ROOTS_INVOICES, '/list'),
        sample: path(ROOTS_INVOICES, `/details/`),
        invoice_details: (id: string): string => path(ROOTS_INVOICES, `/details/${id}`),
    }
}

export const PATH_TASKS = {
    root: ROOTS_TASKS,
}

export const PATH_CALENDAR = {
    root: ROOTS_CALENDAR,
}

export const PATH_AUTH = {
    root: ROOTS_AUTH,
    signin: path(ROOTS_AUTH, '/signin'),
    signup: path(ROOTS_AUTH, '/signup'),
    passwordReset: path(ROOTS_AUTH, '/password-reset'),
}

export const PATH_ERROR = {
    root: ROOTS_ERRORS,
    error403: path(ROOTS_ERRORS, '/403'),
    error404: path(ROOTS_ERRORS, '/404'),
    error500: path(ROOTS_ERRORS, '/500'),
}

export const PATH_START = {
    root: 'https://mantine-analytics-dashboard-docs.netlify.app/getting-started',
}

export const PATH_DOCS = {
    root: 'https://mantine-analytics-dashboard-docs.netlify.app/',
}

export const PATH_CHANGELOG = {
    root: ROOTS_CHANGELOG,
}

export const PATH_GITHUB = {
    org: "https://github.com/design-sparx",
}
