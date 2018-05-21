using System.IO;

namespace TaxiServiceWebAPI.Helpers.DocParsers
{
    public class TextParser : ITextWriter
    {
        public string FilePath { get; set; }

        public TextParser(string filePath)
        {
            this.FilePath = filePath;
        }

        public void WriteText(string message)
        {
            using (StreamWriter w = File.AppendText(FilePath))
            {
                w.WriteLine(message);
            }
        }
    }
}