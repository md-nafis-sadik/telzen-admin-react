import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { errorNotify } from "../../utils/notify";
import {
  setSelectedUserDetailsData,
  setUserDetailsMetaData,
} from "../../features/userDetails/userDetailsSlice";
import {
  useGetAllUserDetailsQuery,
  useDownloadInvoiceMutation,
} from "../../features/userDetails/userDetailsApi";
import { useNavigate, useParams } from "react-router-dom";
import { Select } from "antd";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { getSymbol } from "../../utils/currency";
import { logo } from "../../assets/getAssets";

// ** UserDetails List **
export const useGetUserDetails = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { Id } = useParams();
  const userDetailsId = Id;
  const { dataList, meta, selectedData } = useSelector(
    (state) => state.userDetails
  );
  const { selectedData: selectedUserdata } = useSelector((state) => state.user);
  const { current_page, page_size } = meta || {};

  const apiParams = {
    page: current_page,
    limit: page_size,
    customer_id: userDetailsId,
  };

  // Remove refetchOnMountOrArgChange and control it manually
  const { isLoading, isFetching, isError, error, refetch } =
    useGetAllUserDetailsQuery(apiParams, {
      skip: !userDetailsId,
    });

  // Manual refetch when userId changes
  useEffect(() => {
    if (userDetailsId) {
      refetch();
      // Reset to page 1 when user changes
      dispatch(setUserDetailsMetaData({ ...meta, current_page: 1 }));
    }
  }, [userDetailsId, refetch, dispatch]);
  const updatePageMeta = (value) => dispatch(setUserDetailsMetaData(value));
  const handleSetSelectedUserDetails = (data) =>
    dispatch(setSelectedUserDetailsData(data));

  const { Option } = Select;

  const [downloadInvoice] = useDownloadInvoiceMutation();

  const handleDownloadInvoice = async ({ user, userDetails }) => {
    try {
      const dummyInvoiceData = {
        userName: user.name,
        userPhone: user.phone,
        invoiceNumber: userDetails?.order?.order_id,
        invoiceDate: new Date(
          userDetails?.order?.created_at * 1000
        ).toLocaleDateString("en-US", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
        isPercentage: userDetails?.evaluated_tax?.tax_rate_type === "percentage",
        quantity: 1,
        packageName: userDetails?.static_package?.name,
        rate: `${getSymbol(userDetails?.order?.payment_currency)}${
          userDetails?.evaluated_tax?.currency_results?.USD?.payment_amount_without_tax
        }`,
        amount: `${getSymbol(userDetails?.order?.payment_currency)}${
          userDetails?.evaluated_tax?.currency_results?.USD?.payment_amount_without_tax
        }`,
        tax: `${userDetails?.evaluated_tax?.tax_rate_type === "percentage" ? '' : getSymbol(userDetails?.order?.payment_currency)}${
          userDetails?.evaluated_tax?.tax_rate_type === "percentage" ? `${(userDetails?.evaluated_tax?.currency_results?.USD?.tax_amount*100).toFixed(0)} %` : userDetails?.evaluated_tax?.currency_results?.USD?.tax_amount
        }`,
        total: `${getSymbol(userDetails?.order?.payment_currency)}${
          userDetails?.evaluated_tax?.currency_results?.USD?.payment_amount_with_tax
        }`,
        iccid: userDetails?.esim?.iccid || "ICCID",
        
      };

      // Create a temporary div to hold our invoice HTML
      const tempDiv = document.createElement("div");
      tempDiv.id = "pdf-content";
      tempDiv.style.position = "absolute";
      tempDiv.style.left = "-9999px";
      tempDiv.style.width = "595px"; // A4 width in pixels (approx)
      tempDiv.style.padding = "20px";
      tempDiv.style.fontFamily = "Helvetica, Arial, sans-serif"; // Already good
      tempDiv.style.height = "842px"; // Add this line
      tempDiv.style.boxSizing = "border-box";

      // Add the invoice content to the div
      tempDiv.innerHTML = `
        <div id="pdf-content" style="padding: 20px; width: 100%; max-width: 595px;
          height: 100%; font-family: 'Inter', sans-serif; color: #000; font-size: 10px; display: flex; flex-direction: column; justify-content: space-between;">
          <div>
        <!-- Header -->
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 70px;">
            <img src=${logo} alt="Logo" style="height: 32px;" />
            <div style="font-size: 10px; line-height: 1.5;">
                <div style="color: #1A1C21;
                  font-size: 10px;
                  font-style: normal;
                  font-weight: 600;
                  line-height: 120%; margin-bottom: 3px;" margin-bottom: 3px;>E Galactic e.U.</div>
                <div style="color: #888;
                  font-size: 10px;
                  font-weight: 400;
                  line-height: 130%; margin-bottom: 3px;">Alxingergasse 105/39 1100 Vienna, Austria</div>

                <div style="color: #888;
                  font-size: 10px;
                  font-weight: 400;
                  line-height: 130%;">kontakt@egalactic.com</div>
            </div>
        </div>

        <!-- Billing & Invoice Info -->
        <div style="display: flex; justify-content: space-between; margin-bottom: 50px;">
            <div>
                <div style="color: #888;
                  font-size: 10px;
                  font-weight: 400;
                  line-height: 130%; margin-bottom: 4px;">Billed to</div>
                <div style="color: #191919;
                  font-size: 12px;
                  font-style: normal;
                  font-weight: 600;
                  line-height: 120%; margin-bottom: 4px;">${dummyInvoiceData.userName}</div>
                <div style="color: #191919;
                  font-size: 10px;
                  font-style: normal;
                  font-weight: 400;
                  line-height: 130%;">${dummyInvoiceData.userPhone}</div>
            </div>
            <div>
                <div style="color: #888;
                  font-size: 10px;
                  font-weight: 400;
                  line-height: 130%; margin-bottom: 4px;">Invoice number</div>
                <div style="color: #191919;
                  font-size: 12px;
                  font-style: normal;
                  font-weight: 600;
                  line-height: 120%;">${dummyInvoiceData.invoiceNumber}</div>
            </div>
            <div>
                <div style="color: #888;
                  font-size: 10px;
                  font-weight: 400;
                  line-height: 130%; margin-bottom: 4px;">Invoice date</div>
                <div style="color: #191919;
                  font-size: 12px;
                  font-style: normal;
                  font-weight: 600;
                  line-height: 120%;">${dummyInvoiceData.invoiceDate}</div>
            </div>
        </div>

        <!-- Table -->
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 10px;">
            <thead style="">
                <tr style="text-align: left; border-top: 1px solid #D7DAE0; border-bottom: 1px solid #D7DAE0;">
                    <td style="padding-bottom:15px; padding-top:5px; color: #191919;      
                      font-size: 8px;
                      font-style: normal;
                      font-weight: 400;
                      line-height: 100%; 
                      text-transform: uppercase;">ITEM DETAIL</td>
                    <td style="padding-bottom:15px; padding-top:5px; color: #191919;      
                      font-size: 8px;
                      font-style: normal;
                      font-weight: 400;
                      line-height: 100%; 
                      width: 90px;
                      text-transform: uppercase;;">QTY</td>
                    <td style="padding-bottom:15px; padding-top:5px; color: #191919;      
                      font-size: 8px;
                      font-style: normal;
                      font-weight: 400;
                      line-height: 100%;
                      width: 90px;
                      text-transform: uppercase;">RATE</td>
                    <td style="padding-bottom:15px; padding-top:5px; color: #191919;      
                      font-size: 8px;
                      font-style: normal;
                      font-weight: 400;
                      line-height: 100%;
                      text-align: right;
                      width: 60px;
                      text-transform: uppercase;">AMOUNT</td>
                </tr>
            </thead>
            <tbody>
                <tr style="border-bottom: 1px solid #D7DAE0;">
                    <td style="padding: 12px 0;">
                        <div style="color: #191919;
                          font-size: 12px;
                          font-style: normal;
                          font-weight: 600;
                          line-height: 120%; margin-bottom: 4px;">${dummyInvoiceData.packageName}</div>
                        <div style="color:  #888;
                          font-size: 10px;
                          font-style: normal;
                          font-weight: 400;
                          line-height: 130%;">${dummyInvoiceData.iccid}</div>
                    </td>
                    <td style="color: #191919;
                      font-size: 10px;
                      font-style: normal;
                      font-weight: 400;
                      line-height: 130%;">${dummyInvoiceData.quantity}</td>
                    <td style="color: #191919;
                      font-size: 10px;
                      font-style: normal;
                      font-weight: 400;
                      line-height: 130%;">${dummyInvoiceData.rate}</td>
                    <td style="color: #191919;
                      font-size: 10px;
                      font-style: normal;
                      font-weight: 400;
                      text-align: right;
                      line-height: 130%;">${dummyInvoiceData.amount}</td>
                </tr>
            </tbody>
        </table>

        <!-- Totals -->
        <div style="display: flex; justify-content: flex-end; margin-bottom: 60px;">
            <div style="width: 240px; font-size: 12px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
                    <span style="color: #191919;
                      font-size: 10px;
                      font-style: normal;
                      font-weight: 600;
                      line-height: 120%;">Subtotal</span>
                    <span style="color: #191919;
                      font-size: 10px;
                      font-style: normal;
                      font-weight: 600;
                      line-height: 120%;">${dummyInvoiceData.amount}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
                    <span style="color: #191919;
                      font-size: 10px;
                      font-style: normal;
                      font-weight: 600;
                      line-height: 120%;">Tax</span>
                    <span style="color: #191919;
                      font-size: 10px;
                      font-style: normal;
                      font-weight: 600;
                      line-height: 120%;">${dummyInvoiceData.tax}</span>
                </div>
                <div style="height:1px; border-bottom: 1px solid #D7DAE0; padding-top: 6px;"></div>
                <div style="display: flex; justify-content: space-between; margin-top: 6px;">
                    <span style="color: #191919;
                      font-size: 10px;
                      font-style: normal;
                      font-weight: 600;
                      line-height: 120%;">Total</span>
                    <span style="color: #191919;
                      font-size: 10px;
                      font-style: normal;
                      font-weight: 600;
                      line-height: 120%;">${dummyInvoiceData.total}</span>
                </div>
            </div>
        </div>
        </div>

        <!-- Footer -->
        <div>
            <p style="color: #1A1C21; font-size: 10px;
              font-style: normal;
              font-weight: 600;
              line-height: 120%; margin-bottom: 25px;">Thanks for the business.</p>
            <p style="color: #888; font-size: 10px;
              font-style: normal;
              font-weight: 400;
              line-height: 130%; margin-bottom: 4px;">Terms & Conditions Applied</p>
            <p style="color: #1A1C21; font-size: 10px;
              font-style: normal;
              font-weight: 400;
              line-height: 130%;">Please reach our customer support for any queries.</p>
        </div>
    </div>
      `;

      // Add the div to the document
      document.body.appendChild(tempDiv);

      // Convert to PDF
      const canvas = await html2canvas(tempDiv, {
        scale: 2, // Higher quality
        logging: false,
        useCORS: true,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "pt", "a4");

      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth(); // ✅ fixed line
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);

      // Clean up
      document.body.removeChild(tempDiv);

      pdf.save(`invoice_${dummyInvoiceData.invoiceNumber}.pdf`);
    } catch (error) {
      console.error("Error generating invoice:", error);
      errorNotify("Failed to generate invoice");
    }
  };

  return {
    dataList,
    meta,
    isLoading: isLoading || isFetching,
    isError,
    status: error?.status,
    updatePageMeta,
    selectedData,
    selectedUserdata,
    handleSetSelectedUserDetails,
    Option,
    Select,
    navigate,
    userDetailsId,
    downloadInvoice,
    handleDownloadInvoice,
  };
};
