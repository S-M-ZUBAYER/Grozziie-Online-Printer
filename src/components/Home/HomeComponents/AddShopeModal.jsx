import { useState } from "react";
import { useTranslation } from "react-i18next";
import { PlusIcon, CheckIcon } from "@radix-ui/react-icons";
import * as Checkbox from "@radix-ui/react-checkbox";
import { motion, AnimatePresence } from "framer-motion";

const shope = [
  { id: 1, name: "Shopee" },
  { id: 2, name: "Lazada" },
  { id: 3, name: "TikTok" },
];

function AddShopeModal() {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        className="bg-[#004368] text-white ml-4 px-4 h-[32px] w-[15vw] flex gap-2 items-center rounded-[8px] whitespace-nowrap"
        onClick={() => setIsOpen(true)}
      >
        <PlusIcon className="w-5 h-5" />
        {t("Add Shop")}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white p-6 rounded-lg shadow-lg w-[90vw] max-w-md"
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <h2 className="text-xl font-bold mb-4 text-[#004368] text-center ">
                {t("AddNewShop")}
              </h2>

              <div className="flex gap-8 pb-[160px] pt-10">
                {shope.map((shop) => (
                  <div key={shop.id} className="flex items-center gap-2">
                    <Checkbox.Root
                      className="flex size-[20px] appearance-none items-center justify-center rounded bg-white shadow-[0_2px_6px] shadow-blackA4 outline-none hover:bg-violet3 focus:outline-none focus:shadow-none"
                      defaultChecked
                      id={`shop-${shop.id}`}
                    >
                      <Checkbox.Indicator className="text-violet11">
                        <CheckIcon />
                      </Checkbox.Indicator>
                    </Checkbox.Root>
                    <label
                      className="text-[15px] leading-none text-[#004368]"
                      htmlFor={`shop-${shop.id}`}
                    >
                      {t(shop.name)}
                    </label>
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-4 mt-6">
                <button
                  className="bg-[#0043681A] text-[#004368] px-4 py-2 rounded"
                  style={{ width: "250px" }}
                  onClick={() => setIsOpen(false)}
                >
                  {t("Cancel")}
                </button>
                <button
                  className="bg-[#004368] text-white px-4 py-2 rounded"
                  style={{ width: "250px" }}
                >
                  {t("Next")}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default AddShopeModal;
