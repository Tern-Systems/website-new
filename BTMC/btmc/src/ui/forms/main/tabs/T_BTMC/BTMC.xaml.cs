using System.Collections.Generic;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Media;

using btmc.src.alu;
using toolbox = btmc.src.ui.resources.toolbox;
using btmc.src.ui.forms.main.components;

namespace btmc.src.ui.forms.main.tabs.T_BTMC
{
    using TypeEntry = KeyValuePair<Utils.TypeEnum, string>;
    using CustomComboBox = toolbox.CComboBox.CustomComboBox;

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
            Swap.SwapInputs(InputTextBox, OutputTextBox);
        }

        private void CmbTypeIn_SelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            HandleSelectionChanged(cmbBTMC_Out, cmbBTMC_In, InputTextBox);
        }

        private void CmbTypeOut_SelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            HandleSelectionChanged(cmbBTMC_In, cmbBTMC_Out, OutputTextBox);
        }

        private static void HandleSelectionChanged(
            CustomComboBox otherCombo,
            CustomComboBox changedCombo,
            TextBox relatedTextbox)
        {
            if (otherCombo != null && changedCombo != null && relatedTextbox != null)
            {
                // Prevent duplicate selection
                if (otherCombo.SelectedIndex == changedCombo.SelectedIndex && changedCombo.SelectedIndex > 0)
                {
                    otherCombo.SelectedIndex = 0;
                }

                // Reset textbox to placeholder
                if (relatedTextbox.Tag is string placeholder)
                {
                    relatedTextbox.Text = placeholder;
                    relatedTextbox.Foreground = Brushes.Gray;
                }
                else
                {
                    relatedTextbox.Clear();
                    relatedTextbox.Foreground = Brushes.Gray;
                }
            }
        }
    }
}
