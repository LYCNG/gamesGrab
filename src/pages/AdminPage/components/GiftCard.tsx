import React from "react";
import { MdEdit, MdDelete, MdMoreVert } from "react-icons/md";
import { Gift } from "../../../types/gift";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";

interface GiftCardProps {
  gift: Gift;
  onEdit: (gift: Gift) => void;
  onDelete: (gift: Gift) => void;
}

export const GiftCard: React.FC<GiftCardProps> = ({
  gift,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden px-2 ">
      <div className="flex flex-col md:flex-row md:item-center ">
        {" "}
        {/* 響應式布局 */}
        {/* Image */}
        <div className="w-full md:w-48 h-48 flex-shrink-0">
          <img
            src={gift.imageUrl}
            alt={gift.name}
            className="w-full h-full object-cover"
          />
        </div>
        {/* Content */}
        <div className="flex-1 p-4 md:p-6">
          <div className="flex justify-between items-start">
            <div className="space-y-4 w-full">
              <div className="flex justify-between items-center">
                <h3 className="text-md font-semibold">{gift.name}</h3>
                <Menu as="div" className="relative">
                  <MenuButton className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <MdMoreVert className="w-5 h-5 text-gray-600" />
                  </MenuButton>
                  <MenuItems anchor="bottom end" className="bg-white rounded-lg shadow-lg py-1 px-2 border mt-1">
                    <MenuItem>
                      <button
                        onClick={() => onEdit(gift)}
                        className="group flex w-full items-center gap-2 rounded-lg py-1 px-1 data-[focus]:bg-white/10">
                        <MdEdit className="size-4 fill-gray-500" />
                        修改
                      </button>
                    </MenuItem>
                    <MenuItem>
                      <button
                        onClick={() => onDelete(gift)}
                        className="group flex w-full items-center gap-2 rounded-lg py-1 px-1 data-[focus]:bg-white/10">
                        <MdDelete className="size-4 fill-red-500" />
                        刪除
                      </button>
                    </MenuItem>
              
                   
                  </MenuItems>
                </Menu>
              </div>

              {/* Quantities */}
              <div className="grid grid-cols-3 gap-3 md:gap-6">
                <div className="bg-gray-50 p-3 rounded-lg text-center ">
                  <div className="text-xs md:text-sm text-gray-500">總共</div>
                  <div className="font-semibold text-base md:text-lg">
                    {gift.totalQuantity}
                  </div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg text-center ">
                  <div className="text-xs md:text-sm text-gray-500 w">剩餘</div>
                  <div className="font-semibold text-base md:text-lg text-green-600">
                    {gift.remainingQuantity}
                  </div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg text-center">
                  <div className="text-xs md:text-sm text-gray-500">已抽中</div>
                  <div className="font-semibold text-base md:text-lg text-blue-600">
                    {gift.claimedQuantity}
                  </div>
                </div>
              </div>
              {/* Progress Bar */}
              <div className="w-full max-w-md">
                <div className="text-sm text-gray-500 mb-1">
                  Progress (
                  {Math.round(
                    (gift.claimedQuantity / gift.totalQuantity) * 100
                  )}
                  %)
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${(gift.claimedQuantity / gift.totalQuantity) * 100}%`,
                    }}
                  />
                </div>
              </div>
            </div>
            {/* Actions */}
          </div>
        </div>
      </div>
    </div>
  );
};
