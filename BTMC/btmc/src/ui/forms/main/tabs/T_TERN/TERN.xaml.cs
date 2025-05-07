using System.Windows;
using System.Windows.Controls;
using System.Collections.Generic;

using btmc.src.alu;

using btmc.src.ui.forms.main.components;
using System.Windows.Media;

namespace btmc.src.ui.forms.main.tabs.T_TERN
{
    using OperationEntry = KeyValuePair<ALU.Operation, string>;

    /// <summary>
    /// Interaction logic for TERN.xaml
    /// </summary>
    public partial class TERN : UserControl
    {
        public List<OperationEntry> Operations { get; }
        public Utils.TypePatternEntry TextBoxPattern { get; }

        public TERN()
        {
            InitializeComponent();
           
        }


        private void BtnSwap_Click(object sender, RoutedEventArgs e)
        {
            /* Uncomment after you add the required TextBoxes to the form */
            //Swap.SwapInputs(ref tbTERN_In_1, ref tbTERN_In_2);
        }

        private void TextBox_GotFocus(object sender, RoutedEventArgs e)
        {
            if (sender is TextBox tb)
            {
                string placeholder = tb.Tag as string;

                if (tb.Text == placeholder)
                {
                    tb.Text = "";
                    tb.Foreground = Brushes.White;
                }
            }
        }

        private void TextBox_LostFocus(object sender, RoutedEventArgs e)
        {
            if (sender is TextBox tb)
            {
                if (string.IsNullOrWhiteSpace(tb.Text))
                {
                    string placeholder = tb.Tag as string;
                    tb.Text = placeholder;
                    tb.Foreground = Brushes.Gray;
                }
            }
        }
    }
}
