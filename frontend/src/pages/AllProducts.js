import React, { useEffect, useState } from 'react'
import UploadProduct from '../components/UploadProduct'
import SummaryApi from '../common'
import AdminProductCard from '../components/AdminProductCard'

const AllProducts = () => {
  const [openUploadProduct,setOpenUploadProduct] = useState(false)
  const [allProduct,setAllProduct] = useState([])

  const fetchAllProduct = async() =>{
    try {
      const response = await fetch(SummaryApi.allProduct.url)
      const dataResponse = await response.json()

      console.log("product data",dataResponse)

      setAllProduct(dataResponse?.data || [])
    } catch (error) {
      console.log("error while fetching all product",error)
    }
  }

  useEffect(()=>{
    fetchAllProduct()
  },[])

  return (
    <div>
        <div className='bg-white py-2 px-4 flex justify-between items-center'>
            <h2 className='font-bold text-lg'>All Product</h2>
            <button  className='border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white transition-all py-1 px-3 rounded-full ' onClick={()=>setOpenUploadProduct(true)}>Upload Product</button>
        </div>

        {/**all product */}
        <div className='flex items-center flex-wrap gap-5 py-4 h-[calc(100vh-190px)] overflow-y-scroll'>
          {
            allProduct.length === 0 ? (
              <div className="flex items-center justify-center md:w-1/2 mx-auto ">
                <div className="text-center">
                  <h2 className="font-bold text-lg mb-3">There is no product to show please upload any Product</h2>
                  <button className="border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white transition-all py-1 px-3 rounded-full md:w-1/2" onClick={()=>setOpenUploadProduct(true)}>Upload Product</button>
                </div>
              </div>
            ) : (
              allProduct.map((product,index)=>{
                return(
                  <AdminProductCard data={product} key={product._id} fetchdata={fetchAllProduct}/>

                )
              })
            )
          }
        </div>





        {/**upload prouct component */}
        {
          openUploadProduct && (
            <UploadProduct onClose={()=>setOpenUploadProduct(false)} fetchData={fetchAllProduct}/>
          )
        }


    </div>
  )
}

export default AllProducts
