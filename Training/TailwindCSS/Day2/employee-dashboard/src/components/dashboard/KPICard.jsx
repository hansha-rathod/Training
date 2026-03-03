const KPICard = ({ title, value }) => {
  return (
    <div className="
      bg-white/70 dark:bg-gray-800/70
      backdrop-blur-lg
      border border-white/30 dark:border-gray-700
      rounded-xl2
      p-6
      shadow-md
      hover:shadow-xl
      transition-all duration-300
      hover:-translate-y-1
    ">
      <p className="text-sm text-gray-500 dark:text-gray-200">
        {title}
      </p>

      <h2 className="mt-2 text-2xl font-semibold text-gray-800 dark:text-white">
        {value}
      </h2>
    </div>
  )
}

export default KPICard