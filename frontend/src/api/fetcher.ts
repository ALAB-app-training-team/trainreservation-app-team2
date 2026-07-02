const fetcher = async <T>(url: string): Promise<T> => {
    const res = await fetch(url);

    if (!res.ok) {
        const error = new Error('データ取得中にエラーが発生しました');
        error.message = await res.json().catch(() => null);
        throw error;
    }

    return res.json();
};

export default fetcher;
