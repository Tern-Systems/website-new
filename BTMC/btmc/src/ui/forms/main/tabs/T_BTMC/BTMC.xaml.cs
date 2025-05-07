using System.Windows;
using System.Windows.Controls;
using System.Collections.Generic;

using btmc.src.alu;

using toolbox = btmc.src.ui.resources.toolbox;
using btmc.src.ui.forms.main.components;
using System.Windows.Media;
using System.Diagnostics;

namespace btmc.src.ui.forms.main.tabs.T_BTMC
{
    using TypeEntry = KeyValuePair<Utils.TypeEnum, string>;

    /// <summary>
    /// Interaction logic for BTMC.xaml
    /// </summary>
    public partial class BTMC : UserControl
    {
        public Converter.TypeDict Types { get; }

        public BTMC()
        {
            InitializeComponent();
            Types = Converter.Type;
            DataContext = this;
        }


        private void BtnSwap_Click(object sender, RoutedEventArgs e)
        {
            // Implement it (make sure to reuse as much code as its possible)
        }

        private void CmbTypeIn_SelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            /* Uncomment after you add the required components to the form */
            //_HandleSelectionChanged(ref cmbBTMC_Out, ref cmbBTMC_In, ref tbBTMC_In);
        }

        private void CmbTypeOut_SelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            /* Uncomment after you add the required components to the form */
            //_HandleSelectionChanged(ref cmbBTMC_In, ref cmbBTMC_Out, ref tbBTMC_Out);
        }
        private void TextBox_GotFocus(object sender, RoutedEventArgs e)
        {
            if (sender is TextBox tb && tb.Text == (string)tb.Tag)
            {
                tb.Clear();
                tb.Foreground = Brushes.White;
            }
        }

        private void TextBox_LostFocus(object sender, RoutedEventArgs e)
        {
            if (sender is TextBox tb && string.IsNullOrWhiteSpace(tb.Text))
            {
                tb.Text = (string)tb.Tag;
                tb.Foreground = Brushes.Gray;
            }
        }

        private void SwapButton_Click(object sender, RoutedEventArgs e)
        {
            Swap.SwapInputs(ref InputTextBox, ref OutputTextBox);
        }


        // private static void HandleSelectionChanged(ref toolbox.ComboBox cmb0, ref toolbox.ComboBox cmb1, ref toolbox.TextBox tb)
        // {
        // Implement it
        //}
    }
}
