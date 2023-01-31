import { CheckIcon } from '@heroicons/react/20/solid';
import { Product } from '@stripe/firestore-stripe-payments';
import React from 'react'

interface Props {
    products : Product[];
    selectedPlan : Product | null;
}

function Table(props : Props) {
    const { products, selectedPlan } = props;


  return (
    <table>
        <tbody className="divide-y divide-[gray]">
            <tr className="tableRow">
                <td className="tableTitle">Monthly price</td>
                {products.map(product => 
                    <td key={product.id} className={`tablePlan ${selectedPlan?.id === product.id ? 'text-[#e50914]' : 'text-[gray]'}`} >USD {product.prices[0].unit_amount! / 100 }</td>
                )}
            </tr>
            <tr className="tableRow">
                <td className="tableTitle">Video Quality</td>
                {products.map(product => 
                    <td key={product.id} className={`tablePlan ${selectedPlan?.id === product.id ? 'text-[#e50914]' : 'text-[gray]'}`} >{product.metadata.videoQuality}</td>
                )}
            </tr>
            <tr className="tableRow">
                <td className="tableTitle">Resolution</td>
                {products.map(product => 
                    <td key={product.id} className={`tablePlan ${selectedPlan?.id === product.id ? 'text-[#e50914]' : 'text-[gray]'}`} >{product.metadata.resolution}</td>
                )}
            </tr>
            <tr className="tableRow">
                <td className="tableTitle">Watch on your TV, computer, mobile phone and tablet</td>
                {products.map(product => 
                    <td key={product.id} className={`tablePlan ${selectedPlan?.id === product.id ? 'text-[#e50914]' : 'text-[gray]'}`} >
                        <CheckIcon className="inline-block h-8 w-8" />      
                    </td>
                )}
            </tr>
        </tbody>
    </table>
  )
}

export default Table