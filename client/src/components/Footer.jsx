const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-2 px-4 py-8">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          &copy; {currentYear} Simple Blog. All rights reserved.
        </p>
        <p className="text-sm text-gray-400 dark:text-gray-500">
          Created by{' '}
          <a
            href="https://serkanbayraktar.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-500 transition-colors hover:text-gray-700"
          >
            Serkanby
          </a>
          {' | '}
          <a
            href="https://github.com/Serkanbyx"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-500 transition-colors hover:text-gray-700"
          >
            Github
          </a>
        </p>
      </div>
    </footer>
  )
}

export default Footer
