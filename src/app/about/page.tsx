import Image from "next/image";

export default function AboutPage() {
  return (
    <div className="py-16">
      <div className="container-custom">
        <h1 className="text-4xl font-light mb-20">О НАС</h1>

        <section className="mb-20">
          <div className="max-w-3xl">
            <p className="text-lg leading-relaxed">
              IRNBY TRAINING CLUB — это сообщество единомышленников, объединенных стремлением к здоровому образу жизни и гармоничному развитию личности.
              <br /><br />
              Наш проект появился в 2017 году, когда идейный вдохновитель Анастасия Миронова решила создать уникальную концепцию фитнес-школы, в основе которой лежит комплексный подход к достижению желаемой физической формы и внутренней гармонии.
            </p>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <div className="space-y-6">
            <h2 className="text-2xl font-light">
              <span className="block text-primary">(01)</span>
              <span className="uppercase">БЕЗОПАСНОСТЬ</span>
            </h2>
            <div className="aspect-square relative overflow-hidden bg-gray-100">
              <Image
                src="https://ext.same-assets.com/3026737255/1007424658.svg"
                alt="Безопасность"
                fill
                className="object-cover"
              />
            </div>
            <p className="text-gray-700">
              Каждый день мы создаем среду для безопасного совершенствования. Мы делаем акцент на постепенном выстраивании нового образа жизни, который приносит удовольствие, а не страдание, выступая против жестких ограничений, запретов и быстрых результатов.
            </p>
          </div>

          <div className="space-y-6">
            <h2 className="text-2xl font-light">
              <span className="block text-primary">(02)</span>
              <span className="uppercase">КОМЬЮНИТИ</span>
            </h2>
            <div className="aspect-square relative overflow-hidden bg-gray-100">
              <Image
                src="https://ext.same-assets.com/3026737255/2692404718.svg"
                alt="Комьюнити"
                fill
                className="object-cover"
              />
            </div>
            <p className="text-gray-700">
              Наше сообщество — не просто место для занятий спортом. Это пространство для личностного роста и развития. Мы выстраиваем процесс так, чтобы наши участницы приобрели стройное подтянутое тело, раскрыли свой внутренний потенциал и всегда чувствовали себя полными энергии.
            </p>
          </div>

          <div className="space-y-6">
            <h2 className="text-2xl font-light">
              <span className="block text-primary">(03)</span>
              <span className="uppercase">ЭКСПЕРТНОСТЬ</span>
            </h2>
            <div className="aspect-square relative overflow-hidden bg-gray-100">
              <Image
                src="https://ext.same-assets.com/3026737255/29451733.svg"
                alt="Экспертность"
                fill
                className="object-cover"
              />
            </div>
            <p className="text-gray-700">
              В команде IRNBY TC работают лучшие специалисты в области фитнеса, нутрициологии и психологии. Мы постоянно совершенствуем свои знания, чтобы предлагать участникам самые эффективные программы тренировок и режимов питания.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
