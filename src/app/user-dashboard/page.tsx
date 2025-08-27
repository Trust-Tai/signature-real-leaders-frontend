// "use client";

// import React, { useState } from 'react';
// import { Search, Bell, User, Calendar, Mail, Eye, MousePointer, BarChart3, ChevronLeft, ChevronRight, Linkedin, Music } from 'lucide-react';
// import Image from 'next/image';
// import { images } from '@/assets';

// const Dashboard = () => {
//   const [currentPage, setCurrentPage] = useState(1);
  
//   const sidebarItems = [
//     { icon: Calendar, label: 'Bookings This Month', active: true },
//     { icon: Mail, label: 'Email Subscribers' },
//     { icon: Eye, label: 'Page Views' },
//     { icon: MousePointer, label: 'Total Link Clicks' },
//     { icon: BarChart3, label: 'Audience Demographics' }
//   ];

//   const statsCards = [
//     { number: '50', label: 'BOOKINGS', description: 'New Meetings, Consultations, Or Events Scheduled', color: '#CF3232' },
//     { number: '3,220', label: 'CONTACTS', description: 'People Who Joined Your Mailing List', color: '#CF3232' },
//     { number: '9,475', label: 'PAGE VIEWS', description: 'Total Number Of Times Your Signature Page', color: '#CF3232' },
//     { number: '2,183', label: 'LINK CLICKS', description: 'Combined Total Of Clicks Across All Links', color: '#CF3232' }
//   ];

//   const demographicsData = [
//     { country: 'United States', device: 'Desktop', age: '25-34', role: 'Coaches', percentage: '58%' },
//     { country: 'United Kingdom', device: 'Mobile', age: '35-44', role: 'Entrepreneurs', percentage: '20%' },
//     { country: 'Canada', device: 'Desktop', age: '45-54', role: 'Marketing Directors', percentage: '72%' },
//     { country: 'India', device: 'Mobile', age: '25-34', role: 'Nonprofit Leaders', percentage: '33%' },
//     { country: 'Other', device: 'Desktop', age: '18-24', role: 'Coaches', percentage: '8%' }
//   ];

//   return (
//     <div className="min-h-screen flex bg-[#FFF9F9]" style={{ fontFamily: 'Outfit, sans-serif' }}>
      
//       {/* Sidebar */}
//       <aside className="bg-[#101117] w-64 flex flex-col">
//         {/* Sidebar Header Logo */}
//         <div className="p-6">
//           <div className="flex items-center space-x-2">
//           <Image src={images.realLeaders} alt='' />
//           </div>
//         </div>

//         {/* Sidebar Nav */}
//         <div className="p-6 flex-1">
//           <nav className="space-y-2">
//             {sidebarItems.map((item, index) => (
//               <div 
//                 key={index}
//                 className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors ${
//                   item.active ? 'bg-gray-800 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'
//                 }`}
//               >
//                 <item.icon className="w-5 h-5" />
//                 <span className="text-sm">{item.label}</span>
//               </div>
//             ))}
//           </nav>
//         </div>
//         <div className="text-lg font-bold" style={{marginBottom:50,marginLeft:30}}>
//     <Image src={images.realLeaders} alt='' />
//   </div>
//       </aside>

//       {/* Right Side (Header + Main Content) */}
//       <div className="flex-1 flex flex-col">
        
//         {/* Header */}
//         <header className="bg-[#FFF9F9] px-6 py-4">
//           <div className="flex items-center justify-between">
//             <h1 className="text-[#101117] text-xl font-semibold" style={{ fontFamily: 'Outfit, sans-serif' }}>
//               Signature Dashboard
//             </h1>
            
//             <div className="flex items-center space-x-6">
//               <div className="relative">
//                 <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
//                 <input 
//                   type="text" 
//                   placeholder="Search here..." 
//                   className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm w-64"
//                 />
//               </div>
              
//               <div className="flex items-center space-x-4">
//                 <div className="relative">
//                   <Bell className="w-6 h-6 text-gray-600" />
//                   <span className="absolute -top-2 -right-2 bg-[#CF3232] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
//                     3
//                   </span>
//                 </div>
//                 <div className="relative">
//                   <User className="w-6 h-6 text-gray-600" />
//                   <span className="absolute -top-2 -right-2 bg-[#CF3232] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
//                     16
//                   </span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </header>

//         {/* Main Content */}
//         <main className="flex-1 flex flex-col">
//           <div className="flex-1 flex p-8">
//             {/* Stats Cards */}

//               <div className="flex-1 flex flex-col gap-8">
//            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//             {statsCards.map((card, index) => (
//               <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
//                 <div className="flex items-start justify-between mb-4">
//                   <div>
//                     <h3 className="text-3xl font-bold text-[#101117] mb-1" style={{ fontFamily: 'Outfit-Medium, sans-serif' }}>
//                       {card.number}
//                     </h3>
//                     <p className="text-[#CF3232] font-semibold text-sm tracking-wide" style={{ fontFamily: 'Outfit-Medium, sans-serif' }}>
//                       {card.label}
//                     </p>
//                   </div>
//                   <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center " style={{position:"relative", left:20,top:"-20px"}}>
//                     {/* <ChevronRight className="w-4 h-4 text-[#CF3232]" /> */}
//                     <Image src={images.goArrowIcon} alt=''/>
//                   </div>
//                 </div>
//                 <p className="text-gray-600 text-sm leading-relaxed" style={{ fontFamily: 'Outfit-Regular, sans-serif' }}>
//                   {card.description}
//                 </p>
//               </div>
//             ))}
//           </div>

          
//             {/* Audience Demographics */}
//             <div className="lg:col-span-2">
//               <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 h-full">
//                 <h2 className="text-xl font-semibold text-[#101117] mb-6" style={{ fontFamily: 'Outfit-Medium, sans-serif' }}>
//                   Audience Demographics
//                 </h2>
                
//                 <div className="overflow-x-auto">
//                   <table className="w-full">
//                     <thead>
//                       <tr className="border-b border-gray-100" style={{ backgroundColor: '#FEE3E3CC' }}>
//                         <th className="text-left py-3 px-2 text-sm font-semibold text-[#101117]" style={{ fontFamily: 'Outfit-Medium, sans-serif' }}>Top Countries</th>
//                         <th className="text-left py-3 px-2 text-sm font-semibold text-[#101117]" style={{ fontFamily: 'Outfit-Medium, sans-serif' }}>Devices</th>
//                         <th className="text-left py-3 px-2 text-sm font-semibold text-[#101117]" style={{ fontFamily: 'Outfit-Medium, sans-serif' }}>Age Groups</th>
//                         <th className="text-left py-3 px-2 text-sm font-semibold text-[#101117]" style={{ fontFamily: 'Outfit-Medium, sans-serif' }}>Top Roles</th>
//                         <th className="text-left py-3 px-2 text-sm font-semibold text-[#101117]" style={{ fontFamily: 'Outfit-Medium, sans-serif' }}>% of Total</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {demographicsData.map((row, index) => (
//                         <tr key={index} className="border-b border-gray-50 hover:bg-gray-50">
//                           <td className="py-4 px-2 text-sm text-gray-700" style={{ fontFamily: 'Outfit-Regular, sans-serif' }}>{row.country}</td>
//                           <td className="py-4 px-2 text-sm text-gray-700" style={{ fontFamily: 'Outfit-Regular, sans-serif' }}>{row.device}</td>
//                           <td className="py-4 px-2 text-sm text-gray-700" style={{ fontFamily: 'Outfit-Regular, sans-serif' }}>{row.age}</td>
//                           <td className="py-4 px-2 text-sm text-gray-700" style={{ fontFamily: 'Outfit-Regular, sans-serif' }}>{row.role}</td>
//                           <td className="py-4 px-2 text-sm font-semibold text-[#101117]" style={{ fontFamily: 'Outfit-Medium, sans-serif' }}>{row.percentage}</td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>

//                 <div className="flex items-center justify-between mt-6">
//                   <p className="text-sm text-gray-600" style={{ fontFamily: 'Outfit-Regular, sans-serif' }}>Showing 1 to 8 of 16 Entries</p>
//                   <div className="flex items-center space-x-2">
//                     <button className="p-2 hover:bg-gray-100 rounded">
//                       <ChevronLeft className="w-4 h-4 text-gray-400" />
//                     </button>
//                     <span className="px-3 py-1 bg-[#CF3232] text-white rounded text-sm">1</span>
//                     <span className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded cursor-pointer text-sm">2</span>
//                     <span className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded cursor-pointer text-sm">3</span>
//                     <button className="p-2 hover:bg-gray-100 rounded">
//                       <ChevronRight className="w-4 h-4 text-gray-400" />
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>
// </div>
//             {/* Profile Card */}
//             <div className="w-full lg:w-[439.611px] h-[843.397px] ml-3">
//             <div className="lg:col-span-1">
//               <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 h-full" style={{ backgroundColor: '#CF32321A' }}>
//                 <div className="text-center mb-6">
//                   <div className="w-24 h-24 mx-auto mb-4 rounded-full border-4 border-[#CF3232] overflow-hidden">
//                     <img 
//                       src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" 
//                       alt="Richard Branson" 
//                       className="w-full h-full object-cover"
//                     />
//                   </div>
//                   <h3 className="text-xl font-bold text-[#101117] mb-2" style={{ fontFamily: 'Abolition Test', fontSize:54 }}>
//                     RICHARD BRANSON
//                   </h3>
//                   <p className="text-sm font-semibold text-gray-600 mb-4 font-outfit font-medium" style={{ fontSize: 17 }}>
//                     Founder of the Virgin Group
//                   </p>
//                 </div>

//                 <div className="text-sm text-gray-600 leading-relaxed mb-6 font-outift font-regular" style={{ fontSize:15 }}>
//                   <p>
//                     Founder Of The Virgin Group, Which Has Gone On To Grow Successful Businesses In Sectors Including Mobile Telephony, Travel And Transportation, Financial And Entertainment And Health And Wellness. Virgin Is A Leading International Investment Group And One Of The World's Most Recognised And Respected Brands. Since Starting Youth Culture... 
//                     <span className="text-[#CF3232] cursor-pointer font-medium">Read More</span>
//                   </p>
//                 </div>

//                 <div className="flex justify-center space-x-4 mb-6">
//                   <div className="w-10 h-10 bg-[#FFD9D9] rounded-full flex items-center justify-center cursor-pointer hover:bg-red-600 transition-colors">
//                     <Image src={images.emailIcon} alt='email' />
//                   </div>
//                   <div className="w-10 h-10 bg-[#FFD9D9] rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-700 transition-colors">
//                    <Image src={images.linkedinIcon} alt='linkedin' />
//                   </div>
//                   <div className="w-10 h-10 bg-[#FFD9D9] rounded-full flex items-center justify-center cursor-pointer hover:bg-green-600 transition-colors">
//                     <Image src={images.thirdIcon} alt='music' />
//                   </div>
//                 </div>

//                 <button className="w-full bg-[#CF3232] text-white py-3 rounded-lg font-semibold hover:bg-red-600 transition-colors" style={{ fontFamily: 'Outfit-Medium, sans-serif' }}>
//                   CONNECT
//                 </button>
//               </div>
//             </div>

//           </div>
//           </div>
          
//           {/* Main Content Footer */}
//          <footer className="flex items-center   h-[130px] justify-end px-6 py-4 border-t border-gray-200 bg-[#101117] text-white">
//   {/* Left side */}
  

//   {/* Right side */}
//   <div className="text-sm">
//     © 2025 RealLeaders. All Rights Reserved.
//   </div>
// </footer>
//         </main>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;

"use client";

import React, { useState } from 'react';
import { Search, Bell, ChevronLeft, ChevronRight, Menu, Users } from 'lucide-react';
import Image from 'next/image';
import { images } from '@/assets';
import { UserProfileSidebar, StatsCards } from '@/components';
import UserProfileDropdown from '@/components/ui/UserProfileDropdown';

const Dashboard = () => {

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const statsCards = [
    { number: '50', label: 'BOOKINGS', description: 'New Meetings, Consultations, Or Events Scheduled', color: '#CF3232' },
    { number: '3,220', label: 'CONTACTS', description: 'People Who Joined Your Mailing List', color: '#CF3232' },
    { number: '9,475', label: 'PAGE VIEWS', description: 'Total Number Of Times Your Signature Page', color: '#CF3232' },
    { number: '2,183', label: 'LINK CLICKS', description: 'Combined Total Of Clicks Across All Links', color: '#CF3232' }
  ];

  const demographicsData = [
    { country: 'United States', device: 'Desktop', age: '25-34', role: 'Coaches', percentage: '58%' },
    { country: 'United Kingdom', device: 'Mobile', age: '35-44', role: 'Entrepreneurs', percentage: '20%' },
    { country: 'Canada', device: 'Desktop', age: '45-54', role: 'Marketing Directors', percentage: '72%' },
    { country: 'India', device: 'Mobile', age: '25-34', role: 'Nonprofit Leaders', percentage: '33%' },
    { country: 'Other', device: 'Desktop', age: '18-24', role: 'Coaches', percentage: '8%' }
  ];

  return (
    <div className="min-h-screen flex bg-[#FFF9F9]" style={{ fontFamily: 'Outfit, sans-serif' }}>
      
    
      <UserProfileSidebar 
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        currentPage="user-dashboard"
      />


      {/* Right Side (Header + Main Content) */}
      <div className="flex-1 flex flex-col w-full lg:w-auto">
        
        {/* Header */}
        <header className="bg-[#FFF9F9] px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Mobile Menu Button */}
              <button 
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
              >
                <Menu className="w-6 h-6 text-gray-600" />
              </button>
              
              <h1 className="text-[#101117] text-lg sm:text-xl font-semibold" style={{ fontFamily: 'Outfit SemiBold, sans-serif' }}>
                Signature Dashboard
              </h1>
            </div>
            
            <div className="flex items-center space-x-6">
              {/* Search Bar */}
              <div className="relative hidden sm:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input 
                  type="text" 
                  placeholder="Search here..." 
                  className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm w-48 md:w-64 font-outfit"
                  style={{ color: '#949494' }}
                />
              </div>
              
              {/* Notifications and Profile Icons */}
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Bell className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
                  <span className="absolute -top-2 -right-2 bg-[#CF3232] text-white text-xs rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center text-[10px] sm:text-xs">
                    3
                  </span>
                </div>
                <div className="relative">
                  <Users className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
                  <span className="absolute -top-2 -right-2 bg-[#CF3232] text-white text-xs rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center text-[10px] sm:text-xs">
                    16
                  </span>
                </div>
                <UserProfileDropdown userName="Richard Branson" />
              </div>
            </div>
          </div>
          
          {/* Mobile Search */}
          <div className="relative sm:hidden mt-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search here..." 
              className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm w-full font-outfit"
              style={{ color: '#949494' }}
            />
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 flex flex-col">
          <div className="flex-1 flex flex-col lg:flex-row p-4 sm:p-6 lg:p-8 gap-6">
            
            {/* Left Content */}
            <div className="flex-1 flex flex-col gap-6 lg:gap-8">
              
                            {/* Stats Cards */}
              <StatsCards stats={statsCards} columns={4} />
              {/* Audience Demographics */}
              <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100">
                <h2 className="text-lg sm:text-xl font-semibold text-[#101117] mb-4 sm:mb-6">
                  Audience Demographics
                </h2>
                
                {/* Mobile Table - Stacked Cards */}
                <div className="block sm:hidden space-y-4">
                  {demographicsData.map((row, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-4">
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-gray-500 text-xs">Country:</span>
                          <div className="font-medium text-gray-700">{row.country}</div>
                        </div>
                        <div>
                          <span className="text-gray-500 text-xs">Device:</span>
                          <div className="font-medium text-gray-700">{row.device}</div>
                        </div>
                        <div>
                          <span className="text-gray-500 text-xs">Age:</span>
                          <div className="font-medium text-gray-700">{row.age}</div>
                        </div>
                        <div>
                          <span className="text-gray-500 text-xs">Role:</span>
                          <div className="font-medium text-gray-700">{row.role}</div>
                        </div>
                        <div className="col-span-2 mt-2">
                          <span className="text-gray-500 text-xs">Percentage:</span>
                          <div className="font-bold text-[#CF3232] text-lg">{row.percentage}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Desktop Table */}
                <div className="hidden sm:block overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-100" style={{ backgroundColor: '#FEE3E3CC' }}>
                        <th className="text-left py-3 px-2 text-sm font-semibold text-[#101117]">Top Countries</th>
                        <th className="text-left py-3 px-2 text-sm font-semibold text-[#101117]">Devices</th>
                        <th className="text-left py-3 px-2 text-sm font-semibold text-[#101117]">Age Groups</th>
                        <th className="text-left py-3 px-2 text-sm font-semibold text-[#101117]">Top Roles</th>
                        <th className="text-left py-3 px-2 text-sm font-semibold text-[#101117]">% of Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {demographicsData.map((row, index) => (
                        <tr key={index} className="border-b border-gray-50 hover:bg-gray-50">
                          <td className="py-4 px-2 text-sm sm:text-base font-outfit font-regular text-[#414141]">{row.country}</td>
                          <td className="py-4 px-2 text-sm sm:text-base font-outfit font-regular text-[#414141]">{row.device}</td>
                          <td className="py-4 px-2 text-sm sm:text-base font-outfit font-regular text-[#414141]">{row.age}</td>
                          <td className="py-4 px-2 text-sm sm:text-base font-outfit font-regular text-[#414141]">{row.role}</td>
                          <td className="py-4 px-2 text-sm font-semibold text-[#101117]">{row.percentage}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between mt-6 gap-4">
                  <p className="text-sm text-gray-600 text-center sm:text-left">
                    Showing 1 to 8 of 16 Entries
                  </p>
                  <div className="flex items-center space-x-2">
                    <button className="p-2 hover:bg-gray-100 rounded">
                      <ChevronLeft className="w-4 h-4 text-gray-400" />
                    </button>
                    <span className="px-3 py-1 bg-[#CF3232] text-white rounded text-sm">1</span>
                    <span className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded cursor-pointer text-sm">2</span>
                    <span className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded cursor-pointer text-sm">3</span>
                    <button className="p-2 hover:bg-gray-100 rounded">
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Card */}
            <div className="w-full lg:w-[400px] xl:w-[440px]">
              <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100 h-full" style={{ backgroundColor: '#CF32321A' }}>
                <div className="text-center mb-6">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-4 rounded-full border-4 border-[#CF3232] overflow-hidden">
                    <Image 
                      src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" 
                      alt="Richard Branson" 
                      className="w-full h-full object-cover"
                      width={256}
                      height={256}
                    />
                  </div>
                  <h3 className="text-[#101117] mb-2 leading-tight" style={{ fontFamily: 'Abolition Test', fontSize: '54px' }}>
                    RICHARD BRANSON
                  </h3>
                  <p className="font-outfit font-medium mb-4 text-[#111111]" style={{fontSize:14}}>
                    Founder of the Virgin Group
                  </p>
                </div>

                <div className="font-outfit font-regular mb-6 text-[#000000CC]" style={{fontSize:15}}>
                  <p>
                    Founder Of The Virgin Group, Which Has Gone On To Grow Successful Businesses In Sectors Including Mobile Telephony, Travel And Transportation, Financial And Entertainment And Health And Wellness. Virgin Is A Leading International Investment Group And One Of The World&apos;s Most Recognised And Respected Brands. Since Starting Youth Culture... 
                    <span className="text-[#CF3232] cursor-pointer font-medium">Read More</span>
                  </p>
                </div>

                <div className="flex justify-center space-x-4 mb-6">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#FFD9D9] rounded-full flex items-center justify-center cursor-pointer hover:bg-red-200 transition-colors">
                  <Image src={images.emailIcon} alt='email' />
                  </div>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#FFD9D9] rounded-full flex items-center justify-center cursor-pointer hover:bg-red-200 transition-colors">
                    <Image src={images.linkedinIcon} alt='linkedin' />
                  </div>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#FFD9D9] rounded-full flex items-center justify-center cursor-pointer hover:bg-red-200 transition-colors">
                    <Image src={images.thirdIcon} alt='email' />
                  </div>
                </div>

                <button className="w-full bg-[#CF3232] text-white py-3 rounded-lg font-semibold hover:bg-red-600 transition-colors text-sm sm:text-base">
                  CONNECT
                </button>
              </div>
            </div>
          </div>
          
          {/* Footer */}
          <footer className="flex items-center justify-center lg:justify-end px-4 sm:px-6 py-4 border-t border-gray-200 bg-[#101117] text-white h-[131px]">
            <div className="text-xs sm:text-sm text-center">
              © 2025 RealLeaders. All Rights Reserved.
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;