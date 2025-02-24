import React from 'react'

function CategoryCard({imageUrl,title}) {
    if (title.length > 11) {
        title=title.substring(0,15)+"...";  }
  return (
    <div className=' mx-6 my-2 overflow-hidden  flex flex-col items-center justify-center'>
      <img className='w-16 h-16 overflow-hidden mb-3 rounded-sm  focus:shadow-sm' src={imageUrl} alt="" />
      <div className='text-center text-xs font-bold'>
        {title}
      </div>
    </div>
  )
}

export default CategoryCard
