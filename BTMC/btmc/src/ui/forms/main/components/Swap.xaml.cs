namespace btmc.src.ui.forms.main.components
{
    public partial class Swap : System.Windows.Controls.Button
    {
        public Swap()
        {
            InitializeComponent();
        }

        public static void SwapInputs(ref System.Windows.Controls.TextBox tb1, ref System.Windows.Controls.TextBox tb2)
        {
            (tb1.Text, tb2.Text) = (tb2.Text, tb1.Text);
        }
    }
}
