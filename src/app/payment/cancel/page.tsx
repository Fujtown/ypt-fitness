import Link from 'next/link';

export default function PaymentCancelPage() {

  return (
    <div className="container-custom py-16 min-h-[60vh] flex items-center justify-center">
      <div className="max-w-lg mx-auto bg-white dark:bg-gray-800 p-8 border border-gray-200 dark:border-gray-700">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-orange-500 dark:text-orange-300" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </div>
          <h1 className="text-3xl font-light mb-2">Платеж отменен</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Ваш платеж был отменен. Никакие средства не были списаны с вашего счета.
          </p>
        </div>

        <div className="flex flex-col space-y-4">
          <Link href="/courses" className="bg-primary text-black dark:text-white py-3 px-6 hover:bg-primary/90 transition duration-200 text-center">
            Вернуться к курсам
          </Link>

          <Link href="/" className="border border-gray-300 dark:border-gray-700 py-3 px-6 hover:border-primary transition duration-200 text-center">
            Вернуться на главную
          </Link>
        </div>
      </div>
    </div>
  );
}
