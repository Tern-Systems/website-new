using btmc.src.ui.resources.toolbox;

namespace btmc.src.ui.forms.main.components
{
    /// <summary>
    /// Interaction logic for Swap.xaml
    /// </summary>
    public partial class Clear : System.Windows.Controls.Button
    {
        public Clear()
        {
            InitializeComponent();
        }

        public static void ClearInputs(ref TextBox[] inputs)
        {
            foreach (TextBox input in inputs)
                input.Clear();
        }
    }
}
