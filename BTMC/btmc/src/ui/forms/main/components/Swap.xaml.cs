using btmc.src.ui.resources.toolbox;

namespace btmc.src.ui.forms.main.components
{
    /// <summary>
    /// Interaction logic for Swap.xaml
    /// </summary>
    public partial class Swap : System.Windows.Controls.Button
    {
        public Swap()
        {
            InitializeComponent();
        }

        public static void SwapInputs(ref TextBox tb1, ref TextBox tb2)
        {
            /* Implement these fields inside your custom TextBox before you uncomment it */
            /*string tempPattern = tb1.Pattern;
            tb1.Pattern = tb2.Pattern;
            tb2.Pattern = tempPattern;

            string tempAllowedChars = tb1.AllowedChars;
            tb1.AllowedChars = tb2.AllowedChars;
            tb2.AllowedChars = tempAllowedChars;*/

            /*int tempMaxLength = tb1.MaxLength;
            tb1.MaxLength = tb2.MaxLength;
            tb2.MaxLength = tempMaxLength;*/

            (tb1.Text, tb2.Text) = (tb2.Text, tb1.Text);

        }
    }
}
