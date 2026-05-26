import jalaali from "jalaali-js";

export interface ParsedTransaction {
  id: string;
  type: "buy" | "sell" | "deposit" | "withdraw" | "gift";
  amount: number;
  price?: number;
  total?: number;
  fee: {
    rial: number;
    milli: number;
  };
  createdAt: string;

  walletAfter?: number;
  milliBalance?: number;
}

type Item = { key: string; value: string };

const normalizeText = (text: string) =>
  text
    .replace(/\u200e|\u200f/g, "")
    .replace(/ي/g, "ی")
    .replace(/ك/g, "ک");

const normalizeNumber = (value?: string) => {
  if (!value) return 0;

  const map: Record<string, string> = {
    "۰": "0",
    "۱": "1",
    "۲": "2",
    "۳": "3",
    "۴": "4",
    "۵": "5",
    "۶": "6",
    "۷": "7",
    "۸": "8",
    "۹": "9",
    "٠": "0",
    "١": "1",
    "٢": "2",
    "٣": "3",
    "٤": "4",
    "٥": "5",
    "٦": "6",
    "٧": "7",
    "٨": "8",
    "٩": "9",
  };

  return (
    Number(value.replace(/[۰-۹٠-٩]/g, (d) => map[d]).replace(/[^\d.-]/g, "")) ||
    0
  );
};

const pick = (items: Item[], keys: string[]) =>
  items.find((i) => keys.some((k) => i.key.includes(k)))?.value;

const extractExplicitFee = (items: Item[]) => {
  const rial = normalizeNumber(
    pick(items, [
      "کارمزد بانکی",
      "کارمزد درگاه بانکی",
      "کارمزد ریالی",
      "کارمزد خرید ریال",
      "کارمزد فروش ریال",
    ]),
  );

  const milli = normalizeNumber(
    pick(items, [
      "کارمزد خرید میلی",
      "کارمزد فروش میلی",
      "کارمزد میلی",
      "کارمزد معادل میلی",
    ]),
  );

  return { rial, milli };
};

const deriveFee = (
  type: ParsedTransaction["type"],
  amount: number,
  price: number,
  total?: number,
) => {
  if (!total) return 0;

  const subtotal = amount * price;

  if (type === "buy" && total > subtotal) {
    return total - subtotal;
  }

  if (type === "sell" && subtotal > total) {
    return subtotal - total;
  }

  return 0;
};

export const normalizeTransactionFee = (
  transaction: ParsedTransaction,
): ParsedTransaction => {
  const derivedFee = deriveFee(
    transaction.type,
    transaction.amount,
    transaction.price || 0,
    transaction.total,
  );

  if (derivedFee > 0) {
    return {
      ...transaction,
      fee: {
        rial: derivedFee,
        milli: 0,
      },
    };
  }

  return {
    ...transaction,
    fee: {
      rial: transaction.fee?.rial ?? 0,
      milli: transaction.fee?.milli ?? 0,
    },
  };
};

/**
 * date parser
 */
const parseDate = (value?: string) => {
  if (!value) return new Date().toISOString();

  const normalized = value
    .replace(/[۰-۹]/g, (d) => "۰۱۲۳۴۵۶۷۸۹".indexOf(d).toString())
    .replace(/[٠-٩]/g, (d) => "٠١٢٣٤٥٦٧٨٩".indexOf(d).toString());

  const match = normalized.match(
    /(\d{1,2})\s+(\S+)\s+(\d{4}).*?(\d{1,2}):(\d{2})/,
  );

  if (!match) return new Date().toISOString();

  const [, d, m, y, h, min] = match;

  const months: Record<string, number> = {
    فروردین: 1,
    اردیبهشت: 2,
    خرداد: 3,
    تیر: 4,
    مرداد: 5,
    شهریور: 6,
    مهر: 7,
    آبان: 8,
    آذر: 9,
    دی: 10,
    بهمن: 11,
    اسفند: 12,
  };

  const { gy, gm, gd } = jalaali.toGregorian(Number(y), months[m], Number(d));

  return new Date(gy, gm - 1, gd, Number(h), Number(min)).toISOString();
};

const detectType = (title: string): ParsedTransaction["type"] => {
  const t = normalizeText(title);

  if (t.includes("خرید")) return "buy";
  if (t.includes("فروش")) return "sell";
  if (t.includes("واریز")) return "deposit";
  if (t.includes("برداشت")) return "withdraw";
  return "gift";
};

export const parseApiTransaction = (payload: any): ParsedTransaction => {
  const { title, itemDetails } = payload.data;

  const type = detectType(title);

  const amount = normalizeNumber(
    pick(itemDetails, ["مقدار میلی", "مقدار", "مبلغ هدیه"]),
  );

  const price = normalizeNumber(pick(itemDetails, ["قیمت میلی"]));

  const total =
    normalizeNumber(
      pick(itemDetails, [
        "مبلغ واریزی به کیف پول",
        "مبلغ واریز به کیف پول",
        "مبلغ برداشت شده",
        "معادل ریالی",
      ]),
    ) || amount * price;

  const explicitFee = extractExplicitFee(itemDetails);

  const fee =
    type === "buy" || type === "sell"
      ? {
          rial: deriveFee(type, amount, price, total) || explicitFee.rial || 0,
          milli: explicitFee.milli || 0,
        }
      : explicitFee;

  const createdAt = parseDate(pick(itemDetails, ["زمان"]));

  const walletAfter = normalizeNumber(
    pick(itemDetails, [
      "موجودی کیف پول پس از خرید",
      "موجودی کیف پول پس از فروش",
      "موجودی کیف پول پس از برداشت",
      "موجودی کیف پول پس از",
    ]),
  );

  const milliBalance = normalizeNumber(
    pick(itemDetails, [
      "موجودی حساب میلی پس از خرید",
      "موجودی حساب میلی پس از فروش",
      "موجودی حساب میلی پس از",
    ]),
  );

  return normalizeTransactionFee({
    id: crypto.randomUUID(),
    type,
    amount,
    price,
    total,
    fee,
    createdAt,
    walletAfter,
    milliBalance,
  });
};
