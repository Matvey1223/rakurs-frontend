import React from "react";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";

const ContactsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      <Header />
      <main className="max-w-[1200px] w-full mx-auto px-4 py-10 flex-grow">
        <div className="flex w-full mb-10 h-16">
          <div className="relative bg-[#00C16E] text-white font-bold text-sm sm:text-lg px-4 sm:px-8 flex items-center h-full z-10 w-fit shrink-0 uppercase">
            КОНТАКТЫ
            <div className="absolute top-0 -right-8 w-0 h-0 border-t-[32px] border-t-transparent border-l-[32px] border-l-[#00C16E] border-b-[32px] border-b-transparent" />
          </div>
          <div className="bg-[#006837] flex-grow flex items-center px-8 sm:px-12 h-full text-white font-bold text-xl uppercase tracking-wider pl-12 sm:pl-16">
            КОНТАКТЫ
          </div>
        </div>

        <div className="border border-gray-200 rounded-xl p-8 shadow-sm bg-white space-y-5">
          <div className="text-lg font-bold text-black">Реклама по максимуму и даже больше</div>

          <div className="space-y-2 text-base text-black">
            <div>
              <span className="font-bold">Email:</span>{" "}
              <a
                href="mailto:Reklama_feo@mail.ru"
                className="text-[#006837] hover:text-[#00C16E] transition-colors font-bold"
              >
                Reklama_feo@mail.ru
              </a>
            </div>
            <div>
              <span className="font-bold">ВК:</span>{" "}
              <a
                href="https://vk.com/reklama_feo?from=groups"
                target="_blank"
                rel="noreferrer"
                className="text-[#006837] hover:text-[#00C16E] transition-colors font-bold"
              >
                https://vk.com/reklama_feo?from=groups
              </a>
            </div>
            <div>
              <span className="font-bold">ТГ:</span> тг
            </div>
            <div>
              <span className="font-bold">Яндекс:</span>{" "}
              <a
                href="https://reklamnoe-agentstvo-rakurs.clients.site/"
                target="_blank"
                rel="noreferrer"
                className="text-[#006837] hover:text-[#00C16E] transition-colors font-bold"
              >
                https://reklamnoe-agentstvo-rakurs.clients.site/
              </a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ContactsPage;
