export default function FAQ() {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">Frequently Asked Questions</h1>
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold">How accurate is the plant identification?</h2>
            <p>Our AI model is highly accurate, but results may vary depending on the quality of the image provided.</p>
          </div>
          <div>
            <h2 className="text-xl font-semibold">Can I use the app offline?</h2>
            <p>Currently, an internet connection is required for plant identification.</p>
          </div>
          <div>
            <h2 className="text-xl font-semibold">Is the app free to use?</h2>
            <p>Yes, the app is totally free to use and open source for modifications. We at FloraFusion are committed to Open Source Softwares.</p>
          </div>
        </div>
      </div>
    );
  }
