using System.Windows.Controls;
using System.Windows.Media;
using toolbox = btmc.src.ui.resources.toolbox;

namespace btmc.src.ui.forms.main.components
{
    public partial class Swap : System.Windows.Controls.Button
    {
        public Swap()
        {
            InitializeComponent();
        }

        public static void SwapInputs(TextBox tb1, TextBox tb2)
        {
            // Cast to CustomTextBox if possible to access Placeholder
            var ctb1 = tb1 as toolbox.CTextBox.CustomTextBox;
            var ctb2 = tb2 as toolbox.CTextBox.CustomTextBox;

            var ph1 = ctb1?.Placeholder ?? string.Empty;
            var ph2 = ctb2?.Placeholder ?? string.Empty;

            bool tb1HasUserInput = !string.IsNullOrWhiteSpace(tb1.Text) && tb1.Text != ph1;
            bool tb2HasUserInput = !string.IsNullOrWhiteSpace(tb2.Text) && tb2.Text != ph2;

            if (tb1HasUserInput && tb2HasUserInput)
            {
                (tb1.Text, tb2.Text) = (tb2.Text, tb1.Text);
            }
            else if (tb1HasUserInput)
            {
                tb2.Text = tb1.Text;
                tb2.Foreground = Brushes.White;

                tb1.Clear();
                tb1.Text = ph1;
                tb1.Foreground = Brushes.Gray;
            }
            else if (tb2HasUserInput)
            {
                tb1.Text = tb2.Text;
                tb1.Foreground = Brushes.White;

                tb2.Clear();
                tb2.Text = ph2;
                tb2.Foreground = Brushes.Gray;
            }
        }
    }
}
