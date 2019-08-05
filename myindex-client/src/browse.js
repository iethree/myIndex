import React from 'react';

export function Browse(props){
   return(
      <div className="container padded">
         <div className = "columns">
            <div columns className="is-one-quarter">
               <aide className="menu">
                  <p className="menu-label" >
                     <span>User Indexes</span>
                     <i className="fa fa-caret-up" />
                     <ul className="menu-list">
                        {props.indexes ? props.indexes.map(index=>
                           <li>
                              <a className="index-tab"> {index.name} </a>
                           </li>
                        ): null }
                     </ul>
                  </p>

               </aide>
            </div>
         
         
         </div>
      </div>
   );
}